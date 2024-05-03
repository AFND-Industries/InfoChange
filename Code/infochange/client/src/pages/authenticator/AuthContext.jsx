import React, { useState, useEffect, useContext, createContext } from "react";
import users from "../../data/users.json"

import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authStatus, setAuthStatus] = useState("-2"); // -2: Loading. -1: Server not available. 0 Not logged. 1 Logged
    const [actualUser, setActualUser] = useState(null);

    const getAuthStatus = () => authStatus;
    const getActualUser = () => actualUser;

    async function auth() {
        return await axios.get("http://localhost:1024/auth", {
            withCredentials: true
        });
    }

    const doAuth = async () => {
        let response;

        try {
            response = await auth();

            setAuthStatus(response.data.status);
            if (response.data.status === "1")
                setActualUser(Object.values(users).filter(u => u.profile.username == response.data.user)[0]);
            else
                setActualUser(null);
        } catch (Exception) {
            console.log("El servidor no está disponible en estos momentos.");

            setAuthStatus("-1"); // Pon aqui un 1 si quieres que aunque no vaya el servidor te deje entrar al front-end
            // normalmente tiene que ser un -1, server not available
            //(se puede hacer que diferencie entre si tienes internet o no)
        }

        return response;
    };

    async function login(user, pass) {
        return await axios.get("http://localhost:1024/login?user=" + user + "&pass=" + pass, {
            withCredentials: true
        });
    }

    const doLogin = async (user, pass) => {
        let response;

        try {
            response = await login(user, pass);

            if (response.data.status === "1")
                await doAuth();
        } catch (Exception) {
            console.log("El servidor no está disponible en estos momentos.");

            setAuthStatus("-1");
        }

        return response;
    }

    async function logout() {
        return await axios.get("http://localhost:1024/logout", {
            withCredentials: true
        });
    }

    const doLogout = async () => {
        let response;

        try {
            response = await logout();

            if (response.data.status === "1")
                await doAuth();
        } catch (Exception) {
            console.log("El servidor no está disponible en estos momentos.");

            setAuthStatus("-1");
        }

        return response;
    }

    useEffect(() => {
        doAuth();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                getActualUser,
                getAuthStatus,
                doAuth,
                doLogin,
                doLogout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);