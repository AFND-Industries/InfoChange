export default function Configuration({ profile, swap }) {

    const handleSwap = async () => {
        const loadingScreen = document.getElementById("loading-screen");

        loadingScreen.style.display = "block";
        await swap();
        loadingScreen.style.display = "none";
    };

    return (
        <>
            <div className="row px-5 py-4">
                <div className="col-md-3 mb-2">
                    <div>
                        <button
                            className="btn btn-primary mt-2 mb-2 d-flex"
                            onClick={() => handleSwap()}
                        >
                            Cambiar a modo{" "}
                            {profile.mode === 0 ? "profesional" : "novato"}
                        </button>
                    </div>
                    <span className="text-end">
                        {profile.mode === 0
                            ? "Con el modo profesional, el gráfico de trading tendrá muchas más opciones, " +
                            "además de que mostrará una mayor cantidad de pares. " +
                            "También se muestran más opciones a la hora de introducir la cantidad de compra o venta deseada " +
                            "No se recomienda para usuarios inexpertos."
                            : "Con el modo novato, la cantidad de pares de trading están limitados a los que tienen relación con " +
                            "el dólar estadounidense. Además, el gráfico se simplifica y la forma de comprar y vender es más básica."}
                    </span>
                </div>
            </div>
        </>
    );
}