import React, { useState, useEffect } from "react";

import Loading from "./Loading";
import ServerNotAvailable from "./ServerNotAvailable";
import NotLogged from "./NotLogged";
import App from "../../App";
import UnknownStatus from "./UnknownStatus";

import axios from "axios";

async function auth() {
    return await axios.get("http://localhost:1024/auth", {
        withCredentials: true
    });
}

function Authenticator() {
    const [status, setStatus] = useState("-2"); // -2: Loading. -1: Server not available. 0 Not logged. 1 Logged

    const statusPages = {
        "-2": <Loading />,
        "-1": <ServerNotAvailable />,
        "0": <NotLogged />,
        "1": <App />,
    };

    const getPage = (status) => statusPages[status] ?? <UnknownStatus status={status} />;

    useEffect(() => {
        const fetchAuth = async () => {
            try {
                const response = await auth();
                console.log("El servidor está disponible.");

                setStatus(response.data.status);
            } catch (Exception) {
                console.log("El servidor no está disponible en estos momentos.");

                setStatus("1"); // Pon aqui un 1 si quieres que aunque no vaya el servidor te deje entrar al front-end
                // normalmente tiene que ser un -1, server not available
                //(se puede hacer que diferencie entre si tienes internet o no)
            }
        };

        fetchAuth();
    }, []);

    return getPage(status);
}

export default Authenticator;