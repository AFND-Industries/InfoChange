import { Link } from "react-router-dom";

export default function Unknown() {
  return (
    <div className="container d-flex flex-column justify-content-center align-items-center">
      <div className="card border-danger text-center">
        <h3 className="text-danger">Ups! Parece que esta página no existe</h3>
        <Link to={"/"}>
          <button className="btn btn-outline-danger">Volver a inicio</button>
        </Link>
      </div>
    </div>
  );
}
