import Avatar from "../../../components/Avatar";
import { formatDateTime } from "../../../lib/format";
import { formatAmount } from "./amount";

/**
 * La API resuelve los nombres de usuario de emisor y receptor, asi que ya no
 * hay que buscarlos por id dentro del volcado de la base de datos.
 */
const TransferUser = ({ username }) => (
    <div className="d-flex align-items-center me-3">
        <Avatar
            username={username}
            size={50}
            className="me-2"
        />
        <div className="d-flex flex-column">
            <span>{username}</span>
        </div>
    </div>
);

const BizumAdminItem = ({ item }) => {
    return (
        <li className="list-group-item px-0">
            <div className="row align-items-center justify-content-between">
                <div className="col-md-4 col-5 d-flex align-items-center mb-3 mb-sm-0 justify-content-sm-between">
                    <TransferUser username={item.sender} />
                    <i
                        className="bi bi-arrow-right d-sm-none d-md-block"
                        style={{ fontSize: "1.5em" }}
                    ></i>
                </div>
                <div className="col-2 d-md-none d-sm-flex d-none justify-content-center">
                    <i
                        className="bi bi-arrow-right"
                        style={{ fontSize: "1.5em" }}
                    ></i>
                </div>
                <div className="col-md-4 col-sm-5 col-12 d-flex align-items-center mb-3 mb-sm-0">
                    <TransferUser username={item.recipient} />
                </div>
                <div className="col-md-4 d-flex flex-column align-items-center align-items-md-end">
                    <span className="fw-bold">{formatAmount(item.amount, item.asset)}</span>
                    <span
                        className="text-secondary text-end"
                        style={{ fontSize: "0.9em" }}
                    >
                        {formatDateTime(item.createdAt)}
                    </span>
                </div>
            </div>
        </li>
    );
};

export default BizumAdminItem;
