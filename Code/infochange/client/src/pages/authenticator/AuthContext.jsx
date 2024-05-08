import React, { useState, useEffect, useContext, createContext } from "react";
import users from "../../data/users.json";

import axios from "axios";

const AuthContext = createContext();
const SERVER_URL = "http://localhost:1024";

export const AuthProvider = ({ children }) => {
    const [authStatus, setAuthStatus] = useState("-2"); // -2: Loading. -1: Server not available. 0 Not logged. 1 Logged
    const [actualUser, setActualUser] = useState(null);

    const getAuthStatus = () => authStatus;
    const getActualUser = () => actualUser;

    const get = async (url) =>
        await axios.get(SERVER_URL + url, { withCredentials: true });

    // future changes
    const post = async (url, parameters) =>
        await axios.post(SERVER_URL + url, parameters, {
            withCredentials: true,
        });

    async function auth() {
        const response = await get("/auth");
        const walletRes = await get("/wallet");

        setAuthStatus(response.data.status);
        setActualUser(
            response.data.status === "1"
                ? {
                      profile: response.data.user,
                      wallet: {
                          coins: walletRes.data.wallet,
                      },
                  }
                : null
        );

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

    async function logout() {
        const response = await get("/logout");
        if (response.data.status === "1") await doAuth();

        return response;
    }

    const doAction = async (func) => {
        let response;

        try {
            response = await func();
        } catch (Exception) {
            console.log("El servidor no está disponible en estos momentos.");

            setAuthStatus("-1"); // Pon aqui un 1 si quieres que aunque no vaya el servidor te deje entrar al front-end
            setActualUser(null); // normalmente tiene que ser un -1, server not available
        }

        return response;
    };

    const doAuth = async () => await doAction(() => auth());
    const doLogin = async (user, pass) =>
        await doAction(() => login(user, pass));
    const doLogout = async () => await doAction(() => logout());
    const doRegister = async (user) => await doAction(() => register(user));
    const buyProduct = async (buy) => await post("/payment", buy);

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
                doAuth,
                doLogin,
                doLogout,
                doRegister,
                buyProduct,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
