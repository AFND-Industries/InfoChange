import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  createContext,
} from "react";

import axios from "axios";

const CoinsContext = createContext();
const SERVER_URL = "http://localhost:1024";

export const CoinsAPI = ({ children }) => {
  const [coins, setCoins] = useState([]);

  const get = async (url) =>
    await axios.get(SERVER_URL + url, { withCredentials: true });

  const getCoins = () => coins;

  async function getCoinsAPI() {
    const response = await get("/coins");
    setCoins(response.data);
    return response;
  }

  const doAction = async (func) => {
    let response;

    try {
      response = await func();
    } catch (Exception) {
      console.log("El servidor no está disponible en estos momentos.");
    }

    return response;
  };

  const doGetCoins = async () => await doAction(getCoinsAPI);

  useEffect(() => {
    doGetCoins();

    const interval = setInterval(async () => {
      await doGetCoins();
    }, 120000); // Interval checking auth
    return () => clearInterval(interval);
  }, []);

  return (
    <CoinsContext.Provider value={{ doGetCoins, getCoins }}>
      {children}
    </CoinsContext.Provider>
  );
};

export const useCoins = () => useContext(CoinsContext);
