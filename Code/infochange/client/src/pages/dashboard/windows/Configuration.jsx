export default function Configuration({ profile, swap }) {

    const handleSwap = async () => {
        const loadingScreen = document.getElementById("loading-screen");

        loadingScreen.style.display = "block";
        await swap();
        loadingScreen.style.display = "none";
    };

    const textPro = (
        <>
            <span>Recomendamos usar el modo profesional <span className="fw-bold">únicamente</span> a los usuarios más expertos. </span>
            <span>Con este modo, encontrará disponible un mayor rango de pares para realizar intercambios, además de contar </span>
            <span>con un gráfico más profesional con el que podrá realizar un análisis técnico más avanzado. </span>
            <span>También contará con un método más avanzado para introducir las cantidades de compra y venta deseadas, </span>
            <span>ya que podrá introducir directamente la cantidad del activo que quiere conseguir, además de contar con una </span>
            <span>barra deslizante que le permitirá introducir un porcentaje de su capital disponible.</span>
        </>
    );

    const textNewbie = (
        <>
            <span>El modo novato es ideal para usuarios <span className="fw-bold">nuevos o con poca experiencia</span> en el mundo </span>
            <span>de las criptomonedas. En este modo, el gráfico del panel de <i>Trading</i> se simplifica para mostrar la información esencial </span>
            <span>además de contar con un rango de pares de intercambio limitado a los que están relacionados con el dólar. </span>
            <span>También, se propone un única forma simple de introducir la cantidad que quiere comprar o vender. </span>
            <span>Este modo es ideal para personas con algún tipo de <span className="fw-bold">discapacidad</span> o que pueda verse </span>
            <span>beneficiada por una página más <span className="fw-bold">accesible</span>.</span>
        </>
    );

    return (
        <>
            <div className="row px-5 py-4">
                <div>
                    <div className="d-md-flex d-column align-items-center justify-content-between mt-2 mb-2">
                        <h5 className="m-0 p-0 mb-md-0 mb-2">
                            Actualmente su cuenta está en modo <span className="fw-bold">{profile.mode === 0 ? "Novato" : "Profesional"}</span>
                        </h5>
                        <button
                            className="btn btn-primary d-flex m-0"
                            onClick={() => handleSwap()}
                        >
                            Cambiar a modo{" "}
                            {profile.mode === 0 ? "profesional" : "novato"}
                        </button>
                    </div>
                    <p style={{ textAlign: "justify", textJustify: "inter-word" }}>
                        {textNewbie}
                    </p>
                    <p>
                        {textPro}
                    </p>
                </div>

            </div>
        </>
    );
}