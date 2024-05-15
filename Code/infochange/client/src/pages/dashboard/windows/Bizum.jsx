import { useAPI } from "../../../context/APIContext";

import Banner from "../../../assets/bizum_banner.png";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Bizum({ user }) {
    const { doBizum } = useAPI();

    const [userInput, setUserInput] = useState("");
    const handleUserInput = (event) => setUserInput(event.target.value);

    const [amountInput, setAmountInput] = useState("");
    const handleAmountInput = (event) => setAmountInput(event.target.value);

    const [userList, setUserList] = useState(undefined);
    useEffect(() => { // Esto no está en API context porque solo se usa aquí de manera muy precisa
        const loadBizumUsers = async () => {
            try {
                const responseUsers = await axios.get('http://localhost:1024/bizum_users');
                if (responseUsers.data.status === "1")
                    setUserList(responseUsers.data.users);
            } catch (error) {
                console.error('Error getting users for Bizum:', error);
            }
        };

        loadBizumUsers();
    }, []);

    const handleBizum = async (username, amount) => {
        const sentAmount = parseFloat(amount);

        if (userList !== undefined) {
            const user = Object.values(userList).filter(u => u.username === username)[0];

            if (user !== undefined) {
                const loadingScreen = document.getElementById("loading-screen");

                loadingScreen.style.display = "block";
                const response = await doBizum(user.id, sentAmount);
                loadingScreen.style.display = "none";

                console.log(response);
            }
        }
    }

    const dolarWallet = Object.values(user.wallet).filter(w => w.coin === "USDT");
    const userDolarBalance = dolarWallet.length === 0 ? 0 : dolarWallet[0].quantity;

    return (
        <>
            <div className="row px-5 py-4">
                <div className="col-12 mb-4 text-center">
                    <img src={Banner} style={{ width: "50%", minWidth: "150px" }} />
                </div>
            </div>
            <div className="row mx-5 d-flex align-items-center">
                <div className="col-md-6 mb-4">
                    <div style={{ height: "1.5em" }}></div>
                    <div className="input-group">
                        <span className="input-group-text">@</span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Usuario..."
                            value={userInput}
                            onChange={handleUserInput}
                        />
                    </div>
                </div>
                <div className="col-md-6 mb-4">
                    <span>Disponible: {userDolarBalance.toFixed(2)}$</span>
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Cantidad..."
                            value={amountInput}
                            onChange={handleAmountInput}
                        />
                        <span className="input-group-text">$</span>
                    </div>
                </div>
            </div>
            <div className="row mx-5">
                <div className="col-12 mb-4 text-end">
                    <button
                        className="btn btn-success"
                        onClick={() => handleBizum(userInput, amountInput)}
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </>
    );
}
