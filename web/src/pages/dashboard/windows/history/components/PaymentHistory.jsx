import PaymentItem from "./PaymentItem";

export default function PaymentHistory({ payments, showItems }) {
  const visible = payments.slice(0, showItems);

  return (
    <ul className="list-group list-group-flush p-0 m-0">
      {visible.length === 0 ? (
        <li className="list-group-item text-center">
          <b className="fs-5">No se han encontrado resultados :(</b>
        </li>
      ) : (
        visible.map((payment) => (
          <PaymentItem key={payment.id} payment={payment} />
        ))
      )}
    </ul>
  );
}
