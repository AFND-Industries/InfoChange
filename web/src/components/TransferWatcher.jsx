import { useEffect, useRef } from "react";

import { useTransferHistory } from "../hooks/useHistory";
import { useSession } from "../hooks/useSession";
import { useToast } from "../providers/ToastProvider";
import { formatUsd } from "../lib/format";

/**
 * Avisa cuando llega una transferencia de otro usuario.
 *
 * El aviso se construye con React, de modo que el nombre del remitente se
 * escapa. La version anterior lo inyectaba con `innerHTML`, asi que registrarse
 * con un nombre que contuviera HTML permitia ejecutar codigo en el navegador de
 * quien recibia el dinero.
 */
export function TransferWatcher() {
  const { status, user } = useSession();
  const { data: transfers } = useTransferHistory(status === "authenticated");
  const toast = useToast();
  const lastSeenId = useRef(null);

  useEffect(() => {
    if (!user || !transfers) return;

    const incoming = transfers.filter(
      (transfer) => transfer.recipientId === user.id,
    );
    const latest = incoming[0];
    if (!latest) return;

    // En el primer ciclo solo se toma nota: no hay que avisar de lo que ya
    // estaba ahi cuando el usuario entro.
    if (lastSeenId.current === null) {
      lastSeenId.current = latest.id;
      return;
    }

    if (latest.id !== lastSeenId.current) {
      lastSeenId.current = latest.id;
      toast.success(
        "Transferencia recibida",
        `Has recibido ${formatUsd(latest.amount)} en tu cuenta.`,
      );
    }
  }, [transfers, user, toast]);

  return null;
}
