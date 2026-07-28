import Avatar from "../../../../../components/Avatar";
import { formatDateTime, formatUsd } from "../../../../../lib/format";

function UserSummary({ person }) {
  return (
    <div className="d-flex align-items-center me-3">
      <Avatar username={person.username} size={50} className="me-2" />
      <div className="d-flex flex-column">
        <span>{person.username ?? `#${person.id}`}</span>
        <span className="text-secondary" style={{ fontSize: "0.9em" }}>
          {person.firstName} {person.lastName}
        </span>
      </div>
    </div>
  );
}

export default function BizumItem({ transfer, sender, recipient, outgoing }) {
  return (
    <li className="list-group-item px-0">
      <div className="row align-items-center">
        <div className="col-lg-5 d-flex align-items-center mb-3 mb-lg-0 justify-content-lg-between">
          <UserSummary person={sender} />
          <i className="bi bi-arrow-right" style={{ fontSize: "1.5em" }}></i>
        </div>
        <div className="col-lg-4 d-flex align-items-center mb-3 mb-lg-0">
          <UserSummary person={recipient} />
        </div>
        <div className="col-lg-3 d-flex flex-column align-items-center align-items-lg-end">
          <span className="fw-bold">
            <span className={outgoing ? "text-danger" : "text-success"}>
              {outgoing ? "-" : "+"}
              {formatUsd(transfer.amount)}
            </span>
          </span>
          <span
            className="text-secondary text-end"
            style={{ fontSize: "0.9em" }}
          >
            {formatDateTime(transfer.createdAt)}
          </span>
        </div>
      </div>
    </li>
  );
}
