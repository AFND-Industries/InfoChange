import React, { useState, useEffect, useContext, createContext } from "react";

import { toUser } from "../../types/user";

import axios from "axios";

const AuthContext = createContext();
const SERVER_URL = "http://localhost:1024";

export const AuthProvider = ({ children }) => {
    const [authStatus, setAuthStatus] = useState("-2"); // -2: Loading. -1: Server not available. 0 Not logged. 1 Logged
    const [actualUser, setActualUser] = useState(null);

    const getAuthStatus = () => authStatus;
    const getActualUser = () => actualUser;
    const getActualUserWallet = () => actualUser === null ? null : actualUser.wallet;

    const get = async (url) =>
        await axios.get(SERVER_URL + url, {
            withCredentials: true
        });

    const post = async (url, parameters) =>
        await axios.post(SERVER_URL + url, parameters, {
            withCredentials: true,
        });

    async function auth() { // yo pondria que el wallet lo devolviese tambien el auth y asi es solo una peticion
        const response = await get("/auth");
        const walletRes = await get("/wallet");

        setAuthStatus(response.data.status);

        if (response.data.status === "1") {
            const user = response.data.user;
            const wallet = walletRes.data.wallet;

            setActualUser(prevActualUser => { // Todo esto es para que si no ha cambiado no haga un setState de nuevo y recargue todo
                if (prevActualUser === null || prevActualUser === undefined || JSON.stringify(user) != JSON.stringify(prevActualUser.profile) || JSON.stringify(wallet) != JSON.stringify(prevActualUser.wallet))
                    return toUser(user, wallet);
                else
                    return prevActualUser;
            });
        } else {
            setActualUser(null);
        }

        return response;
    }

    async function login(user, pass) {
        const response = await post("/login", { user: user, pass: pass });
        if (response.data.status === "1") await doAuth();

        return response;
    }

    async function register(user) {
        const response = await post("/register", { user: user });
        if (response.data.status === "1") await doAuth();

        return response;
    }

    async function checkEmail(email) {
        const response = await post("/checkemail", { email: email });
        if (response.data.status === "1") await doAuth();

        return response;
    }

    async function logout() {
        const response = await get("/logout");
        if (response.data.status === "1") await doAuth();

        return response;
    }

    const doAction = async (func) => {
        let response;

        try {
            response = await func();
        } catch (e) {
            console.log("El servidor no está disponible en estos momentos:", e);

            setAuthStatus("-1"); // Pon aqui un 1 si quieres que aunque no vaya el servidor te deje entrar al front-end
            setActualUser(null); // normalmente tiene que ser un -1, server not available
        }

        return response;
    };

    const doAuth = async () => await doAction(() => auth());
    const doLogin = async (user, pass) => await doAction(() => login(user, pass));
    const doLogout = async () => await doAction(() => logout());
    const doCheckEmail = async (email) => await doAction(() => checkEmail(email));
    const doRegister = async (user) => await doAction(() => register(user));

    const buyProduct = async (buy) => await post("/payment", buy);
    const tradeCoins = async (symbol, quantity, type) => await get("/trade?symbol=" + symbol + "&quantity=" + quantity + "&type=" + type);

    useEffect(() => {
        doAuth(); // Initial auth

        const interval = setInterval(async () => await doAuth(), 5000); // Interval checking auth
        return () => clearInterval(interval);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                getActualUser,
                getAuthStatus,
                getActualUserWallet,
                doAuth,
                doCheckEmail,
                doLogin,
                doLogout,
                doRegister,
                buyProduct,
                tradeCoins
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
