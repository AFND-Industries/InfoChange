import React, { useState, useEffect, useContext, createContext } from "react";

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

    async function login(user, pass) {
        return await axios.get("http://localhost:1024/login?user=" + user + "&pass=" + pass, {
            withCredentials: true
        });
    }

    useEffect(() => {
        const fetchAuth = async () => {
            try {
                const response = await auth();
                console.log("El servidor está disponible.");

                setAuthStatus(response.data.status);
                if (response.data.status === "1")
                    setActualUser(response.data.user);
            } catch (Exception) {
                console.log("El servidor no está disponible en estos momentos.");

                setAuthStatus("1"); // Pon aqui un 1 si quieres que aunque no vaya el servidor te deje entrar al front-end
                // normalmente tiene que ser un -1, server not available
                //(se puede hacer que diferencie entre si tienes internet o no)
            }
        };

        fetchAuth();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                getActualUser,
                getAuthStatus,
                login
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);