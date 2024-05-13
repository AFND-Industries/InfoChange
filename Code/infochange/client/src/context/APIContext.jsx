import { createContext } from "react";

const APIContext = createContext();

function APIContext({ children }) {
    const get = async (url) =>
        await axios.get(SERVER_URL + url, {
            withCredentials: true,
        });

    const post = async (url, parameters) =>
        await axios.post(SERVER_URL + url, parameters, {
            withCredentials: true,
        });

    const buyProduct = async (buy) => await post("/payment", buy);

    return (
        <APIContext.Provider value={{ buyProduct }}>
            {children}
        </APIContext.Provider>
    );
}

export const useAPI = () => useContext(APIContext);
