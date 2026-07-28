import Avatar from "../../../../../components/Avatar";
import "./UserItem.css";

export default function UserItem({ user, onClick = () => {} }) {
  return (
    <li
      role="button"
      onClick={onClick}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
    >
      <div className="user-item d-flex align-items-center">
        <Avatar
          username={user.username}
          size={50}
          rounded={false}
          className="rounded rounded-5 me-2"
        />
        <div className="d-flex flex-column">
          <span>{user.username}</span>
          <span className="text-secondary" style={{ fontSize: "0.9em" }}>
            {user.firstName} {user.lastName}
          </span>
        </div>
      </div>
    </li>
  );
}
