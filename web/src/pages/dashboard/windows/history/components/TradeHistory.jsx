import TradeItem from "./TradeItem";

export default function TradeHistory({ trades, showItems }) {
  // La API ya devuelve las operaciones de la mas reciente a la mas antigua. La
  // version anterior las volvia a ordenar con `sort`, que ademas modificaba el
  // array recibido por props.
  const visible = trades.slice(0, showItems);

  return (
    <ul className="list-group list-group-flush p-0 m-0">
      {visible.length === 0 ? (
        <li className="list-group-item text-center">
          <b className="fs-5">No se han encontrado resultados :(</b>
        </li>
      ) : (
        visible.map((trade) => <TradeItem key={trade.id} trade={trade} />)
      )}
    </ul>
  );
}
