/**
 * Indicador de progreso de los cuatro pasos. Es el mismo listado de Bootstrap
 * que ya usaba la pantalla; bs-stepper ha dejado de ser dependencia.
 */
export default function StepList({ action, current }) {
  const isDeposit = action === "in";
  const noun = isDeposit ? "pago" : "ingreso";

  const steps = [
    `1 - Seleccione tipo de ${noun}`,
    "2 - Introduzca los datos requeridos",
    `3 - Resumen de${isDeposit ? " la compra" : "l ingreso"}`,
    `4 - ${isDeposit ? "Pago" : "Ingreso"} completado`,
  ];

  return (
    <aside className="col-md-4">
      <h2 className="fs-4">Pasos del {noun}</h2>{" "}
      <ol className="list-group list-group-flush">
        {steps.map((label, index) => {
          const number = index + 1;

          return (
            <li
              key={label}
              className={"list-group-item" + (current === number ? " active" : "")}
              aria-current={current === number ? "step" : undefined}
            >
              {label}
              {number < current ? (
                <i
                  className="bi bi-check"
                  style={{ fontSize: "20px", color: "green" }}
                ></i>
              ) : null}
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
