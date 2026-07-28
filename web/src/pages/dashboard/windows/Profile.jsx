import Avatar from "../../../components/Avatar";
import { useSession } from "../../../hooks/useSession";

export default function Profile() {
  const { user } = useSession();

  if (!user) return null;

  // Los datos del usuario ya no cuelgan de `profile`: llegan planos y con los
  // mismos nombres que declara `lib/endpoints`.
  const personalInfo = [
    { label: "Nombre de usuario", value: user.username },
    { label: "Nombre", value: user.firstName },
    { label: "Apellidos", value: user.lastName },
    { label: "Email", value: user.email },
  ];

  const taxInformation = [
    { label: "Dirección", value: user.address },
    { label: "Ciudad", value: user.city },
    { label: "País", value: user.country },
    { label: "Código postal", value: user.zipCode },
    { label: "Teléfono", value: user.phone },
  ];

  return (
    <>
      <div className="row px-5 py-4">
        <div className="col-md-3 mb-2">
          <Avatar username={user.username} size={140} />
        </div>
        <div className="col-md-9 d-flex justify-content-between">
          <div className="d-flex align-items-start flex-column justify-content-center">
            <h2>
              {user.firstName} {user.lastName}
            </h2>
            <h3 className="fs-4 text-body-secondary">@{user.username}</h3>
          </div>
        </div>
      </div>
      <hr className="mx-4 my-2" />
      <div className="px-5">
        <h3 className="fs-4 text-body-secondary text-center">
          Información personal
        </h3>
        {personalInfo.map((info) => (
          <InfoRow key={info.label} label={info.label} value={info.value} />
        ))}
      </div>
      <hr className="mx-4 my-2" />
      <div className="px-5">
        <h3 className="fs-4 text-body-secondary text-center">
          Información fiscal
        </h3>
        {taxInformation.map((info) => (
          <InfoRow key={info.label} label={info.label} value={info.value} />
        ))}
      </div>
    </>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="row mb-1">
      <div className="col-md-6 text-md-end">{label}</div>
      <div className="col-md-6">
        <b>{value}</b>
      </div>
    </div>
  );
}
