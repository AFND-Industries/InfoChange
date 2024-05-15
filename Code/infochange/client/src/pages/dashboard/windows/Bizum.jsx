import { useAPI } from "../../../context/APIContext";

import Banner from "../../../assets/bizum_banner.png";

export default function Bizum({ user }) {
    // input
    // disponible
    // cantidad
    // acpetar

    /*
        const loadingScreen = document.getElementById("loading-screen");

        loadingScreen.style.display = "block";
        const response = await doTrade(getActualPair().symbol, paidAmount, action);
        loadingScreen.style.display = "none";
    */
    const dolarWallet = Object.values(user.wallet).filter(w => w.coin === "USDT");
    const userDolarBalance = dolarWallet.length === 0 ? 0 : dolarWallet[0].quantity;

    return (
        <>
            <div className="row px-5 py-4">
                <div className="col-12 mb-4 text-center">
                    <img src={Banner} style={{ width: "40%", minWidth: "150px" }} />
                </div>
            </div>
            <div className="row mx-5 d-flex align-items-center">
                <div className="col-6 mb-4">
                    <div style={{ height: "1.5em" }}></div>
                    <div className="input-group">
                        <span className="input-group-text">@</span>
                        <input type="text" className="form-control" placeholder="Usuario..." />
                    </div>
                </div>
                <div className="col-6 mb-4">
                    <span>Disponible: {userDolarBalance}$</span>
                    <div className="input-group">
                        <input type="text" className="form-control" placeholder="Cantidad..." />
                        <span className="input-group-text">$</span>
                    </div>
                </div>
            </div>
            <div className="row mx-5">
                <div className="col-12 mb-4 text-end">
                    <button className="btn btn-success">Confirmar</button>
                </div>
            </div>
        </>
    );
}
