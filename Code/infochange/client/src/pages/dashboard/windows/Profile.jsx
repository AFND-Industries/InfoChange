export default function Profile(props) {
    const { profile } = props;

    const personalInfo = [
        {
            label: "Nombre de usuario",
            value: profile.username,
        },
        {
            label: "Nombre",
            value: profile.name,
        },
        {
            label: "Apellidos",
            value: profile.lastName,
        },
        {
            label: "Email",
            value: profile.email,
        },
    ];

    const taxInformation = [
        {
            label: "Dirección",
            value: profile.address,
        },
        {
            label: "Ciudad",
            value: profile.ciudad,
        },
        {
            label: "País",
            value: profile.country,
        },
        {
            label: "Código postal",
            value: profile.postalCode,
        },
        {
            label: "Teléfono",
            value: profile.phone,
        },
    ];

    return (
        <>
            <div className="row px-5 py-4">
                <div className="col-md-3 mb-2">
                    <div
                        id="loadingSpinner"
                        className="spinner-border text-primary"
                        role="status"
                        style={{ width: "100px", height: "100px" }}
                    ></div>
                    <img
                        className="rounded-pill"
                        onError={(event) =>
                            (event.target.src =
                                "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg")
                        }
                        src={`https://github.com/${profile.username}.png`}
                        style={{ width: "100%" }}
                        onLoad={(e) => {
                            const spinner =
                                e.target.parentElement.querySelector(
                                    "div[id=loadingSpinner]"
                                );
                            spinner.style.display = "none";
                            e.target.style.display = "block";
                        }}
                    />
                </div>
                <div className="col-md-9 d-flex flex-column justify-content-center">
                    <h2>
                        {profile.name} {profile.lastName}
                    </h2>
                    <h4 className="text-body-secondary">@{profile.username}</h4>
                </div>
            </div>
            <hr className="mx-4 my-2" />
            <div className="px-5">
                <h4 className="text-body-secondary text-center">
                    Información personal
                </h4>
                {personalInfo.map((info) => row(info.label, info.value))}
            </div>
            <hr className="mx-4 my-2" />
            <div className="px-5">
                <h4 className="text-body-secondary text-center">
                    Información fiscal
                </h4>
                {taxInformation.map((info) => row(info.label, info.value))}
            </div>
        </>
    );
}

function row(label, value) {
    return (
        <div key={label} className="row mb-1">
            <div className="col-md-6 text-md-end">{label}</div>
            <div className="col-md-6">
                <b>{value}</b>
            </div>
        </div>
    );
}
