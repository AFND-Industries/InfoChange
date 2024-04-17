import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="container">
      <h1>Panel de control</h1>
      <p>
        Aquí puedes administrar todo lo relacionado con tu cuenta de InfoChange.
      </p>
      <Link to="/payment" className="btn btn-primary">
        Añadir saldo
      </Link>
    </div>
  );
}
