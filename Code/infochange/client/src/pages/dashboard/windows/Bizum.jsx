import React, { useEffect, useState } from "react";

import BizumToast from "../components/BizumToast";
import Banner from "../../../assets/bizum_banner.png";

import { useAPI } from "../../../context/APIContext";

import axios from "axios";
import UserItem from "../components/UserItem";

const countDecimals = (number) => {
    const decimalIndex = number.indexOf('.');
    return decimalIndex === -1 ? 0 : number.length - decimalIndex - 1;
}

export default function Bizum({ user }) {
    const { doBizum } = useAPI();

    const MAXVALUE = 1000000000;
    const MAXDECIMALS = 2;

    const [userRegexList, setUserRegexList] = useState([]);
    const [userInput, setUserInput] = useState("");
    const handleUserInput = (regex) => {
        setUserInput(regex);

        setUserRegexList(userList !== undefined && regex.length > 0 ?
            Object.values(userList).filter(u => u.id != user.profile.ID &&
                u.username.toLowerCase().startsWith(regex.toLowerCase())).slice(0, 5) : []);
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

    const isInputInvalid = amountInput !== '' && parseFloat(amountInput) > userDolarBalance;
    const activeButton =
        parseFloat(amountInput) <= userDolarBalance &&
        parseFloat(amountInput) > 0 &&
        userRegexList[0] !== undefined &&
        userRegexList[0].username === userInput &&
        userRegexList[0].id != user.profile.ID;

    const usersObject = userList === undefined ? [] :
        userRegexList.map(user => (
            <UserItem user={user} onClick={() => handleUserInput(user.username)} />
        ));

    return (
        <>
            <div className="row px-5 py-4">
                <div className="col-12 mb-4 text-center">
                    <img src={Banner} style={{ width: "50%", minWidth: "150px" }} />
                </div>
            </div>

            <div className="row mx-5 d-flex align-items-center">
                <div className="col-md-7 mb-4">
                    <div style={{ height: "1.5em" }}></div>
                    <div className="d-flex">
                        <div className="dropdown w-100 me-2">
                            <input
                                data-bs-toggle="dropdown"
                                className="form-control dropdown-toggle"
                                placeholder="Buscar usuario..."
                                style={{ backgroundColor: "#ffffff", color: "#000000" }}
                                value={userInput}
                                onChange={(event) => handleUserInput(event.target.value)} />

                            <ul className="dropdown-menu" style={{ opacity: (usersObject.length > 0 ? "100%" : "0") }}>
                                {usersObject}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-4">
                    <span>Disponible: {userDolarBalance.toFixed(2)}$</span>
                    <div className="input-group">
                        <input
                            type="text"
                            className={"form-control" + (isInputInvalid ? " is-invalid" : "")}
                            placeholder="Cantidad..."
                            value={amountInput}
                            onChange={handleAmountInput}
                        />
                        <span className="input-group-text">$</span>
                    </div>
                </div>
                <div className="col-md-2 mb-4">
                    <div style={{ height: "1.5em" }}></div>
                    <button
                        className={`btn btn-success${activeButton ? "" : " disabled"}`}
                        onClick={() => handleBizum(userRegexList[0], amountInput)}
                    >
                        Confirmar
                    </button>
                </div>
            </div >

            <BizumToast />
        </>
    );
}
