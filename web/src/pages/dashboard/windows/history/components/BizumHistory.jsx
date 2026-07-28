import BizumItem from "./BizumItem";

/** Nombre conocido del usuario o, si no esta en el listado, su identificador. */
const describe = (id, directory) =>
  directory.get(id) ?? { id, username: null, firstName: "Usuario", lastName: `#${id}` };

export default function BizumHistory({
  transfers,
  showItems,
  directory,
  currentUserId,
}) {
  const visible = transfers.slice(0, showItems);

  return (
    <ul className="list-group list-group-flush p-0 m-0">
      {visible.length === 0 ? (
        <li className="list-group-item text-center">
          <b className="fs-5">No se han encontrado resultados :(</b>
        </li>
      ) : (
        visible.map((transfer) => (
          <BizumItem
            key={transfer.id}
            transfer={transfer}
            sender={describe(transfer.senderId, directory)}
            recipient={describe(transfer.recipientId, directory)}
            outgoing={transfer.senderId === currentUserId}
          />
        ))
      )}
    </ul>
  );
}
