export default function Configuration({ profile, swap }) {
    const handleSwap = async () => {
        const loadingScreen = document.getElementById("loading-screen");

        loadingScreen.style.display = "block";
        await swap();
        loadingScreen.style.display = "none";
    };

    const textPro = (
        <>
            <span>
                Recomendamos usar el modo profesional{" "}
                <span className="fw-bold">únicamente</span> a los usuarios más
                expertos.{" "}
            </span>
            <span>
                Con este modo, encontrará disponible un mayor rango de pares
                para realizar intercambios, además de contar{" "}
            </span>
            <span>
                con un gráfico más profesional con el que podrá realizar un
                análisis técnico más avanzado.{" "}
            </span>
            <span>
                También contará con un método más avanzado para introducir las
                cantidades de compra y venta deseadas,{" "}
            </span>
            <span>
                ya que podrá introducir directamente la cantidad del activo que
                quiere conseguir, además de contar con una{" "}
            </span>
            <span>
                barra deslizante que le permitirá introducir un porcentaje de su
                capital disponible.{" "}
            </span>
            <span>
                Por último, con el modo profesional, para agilizar los trades,
                <span className="fw-bold"> NO</span> se le pedirá una confirmación
                cada vez que quiera realizar uno.
            </span>
        </>
    );

    const textNewbie = (
        <>
            <span>
                El modo novato es ideal para usuarios{" "}
                <span className="fw-bold">nuevos o con poca experiencia</span>{" "}
                en el mundo{" "}
            </span>
            <span>
                de las criptomonedas. En este modo, el gráfico del panel de{" "}
                <i>Trading</i> se simplifica para mostrar la información
                esencial{" "}
            </span>
            <span>
                además de contar con un rango de pares de intercambio limitado a
                los que están relacionados con el dólar.{" "}
            </span>
            <span>
                También, se propone un única forma simple de introducir la
                cantidad que quiere comprar o vender.{" "}
            </span>
            <span>
                Este modo es ideal para personas con algún tipo de{" "}
                <span className="fw-bold">discapacidad</span> o que pueda verse{" "}
            </span>
            <span>
                beneficiada por una página más{" "}
                <span className="fw-bold">accesible</span>.
            </span>
        </>
    );

    return (
        <>
            <div className="row px-5 py-4">
                <div>
                    <div className="d-md-flex d-column align-items-center justify-content-between mt-2 mb-3">
                        <h5 className="m-0 p-0 mb-md-0 mb-2">
                            Actualmente su cuenta está en modo{" "}
                            <span className="fw-bold">
                                {profile.mode === 0 ? "Novato" : "Profesional"}
                            </span>
                        </h5>
                        <div
                            className="form-check form-switch"
                            onClick={() => handleSwap()}
                        >
                            <input
                                class="form-check-input fs-5"
                                aria-label={
                                    (profile.mode === 0
                                        ? "Activar"
                                        : "Desactivar") + " modo profesional"
                                }
                                type="checkbox"
                                id="flexSwitchCheckDefault"
                                checked={profile.mode === 1}
                            />
                            <label
                                class="form-check-label fs-5"
                                for="flexSwitchCheckDefault"
                            >
                                Modo profesional{" "}
                                <b>
                                    {profile.mode === 0
                                        ? "desactivado"
                                        : "activado"}
                                </b>
                            </label>
                        </div>
                    </div>
                    <p
                        style={{
                            textAlign: "justify",
                            textJustify: "inter-word",
                        }}
                    >
                        {textNewbie}
                    </p>
                    <p>{textPro}</p>
                </div>
            </div>
        </>
    );
}
