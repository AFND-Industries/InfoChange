export default function Profile(props) {
    const { profile, swap } = props;

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

    const handleSwap = async () => {
        const loadingScreen = document.getElementById("loading-screen");

        loadingScreen.style.display = "block";
        await swap();
        loadingScreen.style.display = "none";
    }

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
                        alt={`Foto de perfil de ${profile.username}`}
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
                <div className="col-md-9 d-flex justify-content-between">
                    <div className="d-flex align-items-start flex-column justify-content-center">
                        <h2>
                            {profile.name} {profile.lastName}
                        </h2>
                        <h4 className="text-body-secondary">@{profile.username}</h4>
                    </div>
                    <div className="col-6 d-flex justify-content-start align-items-end flex-column">
                        <div>
                            <button className="btn btn-primary mt-2 mb-2 d-flex" onClick={() => handleSwap()}>
                                Cambiar a modo {profile.mode === 0 ? "profesional" : "novato"}
                            </button>
                        </div>
                        <span className="text-end">
                            {profile.mode === 0 ?
                                "Con el modo profesional, el gráfico de trading tendrá muchas más opciones, " +
                                "además de que mostrará una mayor cantidad de pares. " +
                                "También se muestran más opciones a la hora de introducir la cantidad de compra o venta deseada " +
                                "No se recomienda para usuarios inexpertos."
                                :
                                "Con el modo novato, la cantidad de pares de trading están limitados a los que tienen relación con " +
                                "el dólar estadounidense. Además, el gráfico se simplifica y la forma de comprar y vender es más básica."}
                        </span>
                    </div>
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
