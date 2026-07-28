/**
 * Indicador de pasos del registro.
 *
 * Sustituye al `<Stepper>` de MUI, que arrastraba toda la libreria (y Emotion)
 * solo para pintar tres circulos. Aqui son clases de Bootstrap y el paso en
 * curso se anuncia con `aria-current="step"`.
 */
export default function RegisterStepper({ steps, activeStep }) {
  return (
    <ol
      className="list-unstyled d-flex justify-content-between align-items-start gap-2 mb-0 px-2 py-3"
      aria-label="Progreso del registro"
      // `list-unstyled` pone `list-style: none`, y con eso Safari deja de
      // exponer la lista como tal; el rol explicito conserva el recuento de
      // pasos que anuncia el lector de pantalla.
      role="list"
    >
      {steps.map((label, index) => {
        const isActive = index === activeStep;
        const isCompleted = index < activeStep;
        const circleStyle =
          isActive || isCompleted
            ? "bg-primary border-primary text-white"
            : "bg-light border-secondary-subtle text-secondary";

        return (
          <li
            key={label}
            className="d-flex flex-column align-items-center flex-fill text-center"
            aria-current={isActive ? "step" : undefined}
          >
            <span
              className={`d-flex align-items-center justify-content-center rounded-circle border fw-bold ${circleStyle}`}
              style={{ width: "2.25rem", height: "2.25rem" }}
              aria-hidden="true"
            >
              {index + 1}
            </span>
            <span className={`small mt-2 ${isActive ? "fw-bold" : "text-muted"}`}>
              {label}
            </span>
            <span className="visually-hidden">
              {`Paso ${index + 1} de ${steps.length}: `}
              {isCompleted ? "completado" : isActive ? "paso actual" : "pendiente"}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
