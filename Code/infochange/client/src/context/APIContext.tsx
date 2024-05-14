import React from "react";

import axios, { AxiosResponse } from "axios"
import { Cart } from "../@types/payment";
import { APIContextType } from "../@types/APIContextType";

const APIContext = React.createContext<APIContextType | null>(null);

const SERVER_URL = "http://localhost:1024"

export const APIProvider : React.FC<{children : React.ReactNode}> = ({ children }) =>  {
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

export const useAPI : () => APIContextType | null = () => React.useContext(APIContext);
