export default function PaymentCompleted(props) {
  const { cart } = props;

  return (
    <div>
      <h6>Pago completado</h6>
      <div className="container">
        <div className="row">
          <div className="col-12 text-center">
            <img src={CheckIcon} width={"10%"} />
            <h4>Pago completado con éxito</h4>
          </div>
        </div>
        <p>
          <table></table>
        </p>
      </div>
    </div>
  );
}
