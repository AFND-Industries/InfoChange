import { z } from "zod";

const trimmed = (max: number) => z.string().trim().min(1).max(max);

/** Cantidad monetaria: llega como cadena o numero y siempre debe ser positiva. */
export const amountSchema = z
  .union([z.string(), z.number()])
  .transform((value) => String(value).trim())
  .refine((value) => /^\d+(\.\d+)?$/.test(value), {
    message: "La cantidad debe ser un numero positivo.",
  })
  .refine((value) => Number(value) > 0, {
    message: "La cantidad debe ser mayor que cero.",
  })
  // Un simulador no necesita cifras astronomicas y asi el valor cabe de sobra
  // en numeric(38, 18).
  .refine((value) => Number(value) <= 1_000_000_000, {
    message: "La cantidad supera el maximo permitido.",
  });

export const registerSchema = z.object({
  firstName: trimmed(60),
  lastName: trimmed(80),
  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha debe tener el formato AAAA-MM-DD")
    .refine((value) => {
      const date = new Date(`${value}T00:00:00Z`);
      if (Number.isNaN(date.getTime())) return false;
      const age =
        (Date.now() - date.getTime()) / (365.2425 * 24 * 60 * 60 * 1000);
      return age >= 18 && age <= 120;
    }, "Debes ser mayor de edad."),
  gender: z.enum(["male", "female", "other"]),
  username: z
    .string()
    .trim()
    .min(3)
    .max(30)
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "El usuario solo puede contener letras, numeros, guiones y guiones bajos.",
    ),
  email: z.string().trim().toLowerCase().email().max(254),
  password: z
    .string()
    .min(10, "La contrasena debe tener al menos 10 caracteres.")
    .max(200)
    .refine(
      (value) => /[a-zA-Z]/.test(value) && /\d/.test(value),
      "La contrasena debe combinar letras y numeros.",
    ),
  securityQuestionId: z.coerce.number().int().positive(),
  securityAnswer: trimmed(120),
  address: trimmed(160),
  city: trimmed(80),
  zipCode: trimmed(12),
  country: trimmed(80),
  phone: trimmed(30),
  documentId: trimmed(40),
});

export const loginSchema = z.object({
  username: trimmed(254),
  password: z.string().min(1).max(200),
});

export const checkEmailSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
});

export const tradeSchema = z.object({
  symbol: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9]{4,24}$/, "Simbolo invalido."),
  quantity: amountSchema,
  side: z.enum(["BUY", "SELL"]),
});

export const transferSchema = z.object({
  recipientId: z.coerce.number().int().positive(),
  amount: amountSchema,
});

/**
 * Del medio de pago solo se conserva una referencia enmascarada. El CVV, el
 * numero completo de la tarjeta y la contrasena de PayPal se validan para dar
 * feedback al usuario y se descartan: nunca llegan a la base de datos.
 */
export const paymentMethodSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("CARD"),
    holder: trimmed(120),
    number: z
      .string()
      .trim()
      .transform((value) => value.replace(/[\s-]/g, ""))
      .refine((value) => /^\d{13,19}$/.test(value), "Numero de tarjeta invalido."),
    expiry: z
      .string()
      .trim()
      .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "La caducidad debe tener el formato MM/AA"),
    cvv: z.string().trim().regex(/^\d{3,4}$/, "CVV invalido."),
  }),
  z.object({
    type: z.literal("IBAN"),
    holder: trimmed(120),
    iban: z
      .string()
      .trim()
      .transform((value) => value.replace(/\s/g, "").toUpperCase())
      .refine(
        (value) => /^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/.test(value),
        "IBAN invalido.",
      ),
  }),
  z.object({
    type: z.literal("PAYPAL"),
    email: z.string().trim().toLowerCase().email().max(254),
  }),
]);

export const paymentSchema = z.object({
  amount: amountSchema,
  method: paymentMethodSchema,
});

export type PaymentMethod = z.infer<typeof paymentMethodSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

/** Referencia que si se guarda: suficiente para reconocer el medio, inutil para usarlo. */
export function maskPaymentMethod(method: PaymentMethod): string {
  switch (method.type) {
    case "CARD":
      return `**** **** **** ${method.number.slice(-4)}`;
    case "IBAN":
      return `${method.iban.slice(0, 4)} **** ${method.iban.slice(-4)}`;
    case "PAYPAL": {
      const [name, domain] = method.email.split("@");
      const visible = name!.slice(0, 2);
      return `${visible}***@${domain}`;
    }
  }
}
