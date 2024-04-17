export default function Profile(props) {
  const { profile } = props;

  return (
    <>
      <div className="row p-5">
        <div className="col-md-3 mb-2">
          <img
            className="rounded-pill"
            src={`https://github.com/${profile.username}.png`}
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-md-9 d-flex flex-column justify-content-center">
          <h2>{profile.username}</h2>
          <h4 className="text-body-secondary">
            {profile.name} {profile.surname}
          </h4>
        </div>
      </div>
    </>
  );
}
