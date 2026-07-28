import Avatar from "../../../components/Avatar";
import { formatUsd } from "../../../lib/format";

const UserBalanceItem = ({ user }) => {
    return (
        <li className="list-group-item ps-0 pe-0 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
                <Avatar
                    username={user.username}
                    size={50}
                    rounded={false}
                    className="rounded rounded-5 me-2"
                />
                <div className="d-flex flex-column">
                    <span>{user.username}</span>
                    <span
                        className="text-secondary"
                        style={{ fontSize: "0.9em" }}
                    >
                        {user.firstName} {user.lastName}
                    </span>
                </div>
            </div>
            <span className="fw-bold h5 m-0">
                {formatUsd(user.balanceUsd)}
            </span>
        </li>
    );
};

export default UserBalanceItem;
