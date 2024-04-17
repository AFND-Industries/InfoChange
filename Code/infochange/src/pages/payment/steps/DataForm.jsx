export function PaypalForm() {
  return (
    <div>
      <h6>Introduzca los datos de su cuenta de Paypal</h6>
      <div className="container">
        <div className="row mb-3">
          <div className="col-4">
            <label>Correo electrónico</label>
          </div>
          <div className="col-8">
            <input type="text" className="form-control" />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-4">
            <label>Contraseña</label>
          </div>
          <div className="col-8">
            <input type="password" className="form-control" />
          </div>
        </div>
      </div>
    </div>
  );
}
export function CreditForm() {}
