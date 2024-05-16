import React, { useEffect, useState } from "react";

import BizumToast from "../components/BizumToast";
import Banner from "../../../assets/bizum_banner.png";

import { useAPI } from "../../../context/APIContext";

import axios from "axios";

const countDecimals = (number) => {
    const decimalIndex = number.indexOf('.');
    return decimalIndex === -1 ? 0 : number.length - decimalIndex - 1;
}

export default function Bizum({ user }) {
    const { doBizum } = useAPI();

    const MAXVALUE = 1000000000;
    const MAXDECIMALS = 2;

    const [bizumedUser, setBizumedUser] = useState(undefined);
    const [userInput, setUserInput] = useState("");
    const handleUserInput = (event) => {
        setUserInput(event.target.value);
        setBizumedUser(userList !== undefined ? Object.values(userList).filter(u => u.username === event.target.value)[0] : userList);
    }

    const [amountInput, setAmountInput] = useState("");
    const handleAmountInput = (event) => {
        const value = event.target.value;
        const parsedValue = parseFloat(value);

        if (value === "" || (!isNaN(value) && parsedValue >= 0 && countDecimals(value) <= MAXDECIMALS && parsedValue < MAXVALUE))
            setAmountInput(event.target.value.trim());
    }

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

    const handleBizum = async (user, amount) => {
        const sentAmount = parseFloat(amount);

        if (userList !== undefined && user !== undefined) {
            const loadingScreen = document.getElementById("loading-screen");

            loadingScreen.style.display = "block";
            const response = await doBizum(user.id, sentAmount);
            loadingScreen.style.display = "none";

            if (response.data.status === "1")
                showBizumDoneToast("Bizum realizado correctamente",
                    "Has enviado un bizum de <b>" + sentAmount + "$</b> a <b>" + user.username + "</b> correctamente.");
        }
    }

    const dolarWallet = Object.values(user.wallet).filter(w => w.coin === "USDT");
    const userDolarBalance = dolarWallet.length === 0 ? 0 : dolarWallet[0].quantity;
    const showBizumDoneToast = (title, message) => {
        const toast = new bootstrap.Toast(document.getElementById("bizum-toast"), {
            autohide: true
        });
        const toastTitle = document.getElementById("bizum-toast-title");
        const toastBody = document.getElementById("bizum-toast-body");

        toastTitle.innerHTML = title;
        toastBody.innerHTML = message;

        toast.show();
    }

    const activeButton = parseFloat(amountInput) <= userDolarBalance && parseFloat(amountInput) > 0 && bizumedUser !== undefined;

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
                        className={`btn btn-success${activeButton ? "" : " disabled"}`}
                        onClick={() => handleBizum(userInput, amountInput)}
                    >
                        Confirmar
                    </button>
                </div>
            </div>

            <BizumToast />
        </>
    );
}
