import React, { createContext, useContext } from "react";

import axios from "axios"
import { Cart } from "../types/payment";

const APIContext = createContext({});

const SERVER_URL = "localhost:1024"

export const APIProvider = ({ children }) =>  {
    const get = async (url : String) =>
        await axios.get(SERVER_URL + url, {
            withCredentials: true,
        });

    const post = async (url : String, parameters : Object) =>
        await axios.post(SERVER_URL + url, parameters, {
            withCredentials: true,
        });

    const buyProduct = async (buy : Cart) => await post("/payment", buy);

    return (
        <APIContext.Provider value={{ buyProduct }}>
            {children}
        </APIContext.Provider>
    );
}

export const useAPI = () => useContext(APIContext);
