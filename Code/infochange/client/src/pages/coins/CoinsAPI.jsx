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
  const [coins, setCoins] = useState(() => {
    const savedCoins = localStorage.getItem("coins");
    return savedCoins ? JSON.parse(savedCoins) : [];
  });

  const coinsData = useRef(coins);

  const get = async (url) =>
    await axios.get(SERVER_URL + url, { withCredentials: true });

  const getCoins = () => coins;

  async function getCoinsAPI() {
    console.log(coinsData.current.length);
    if (coinsData.current.length === 0) {
      console.log("coins empty");
      const response = await get("/coins");
      setCoins(response.data);
      coinsData.current = response.data;
      console.log("coins set");
      localStorage.setItem("coins", JSON.stringify(response.data));

      return response;
    }
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
    console.log("FirstCoins called");
    doGetCoins();

    const interval = setInterval(async () => {
      console.log("calling coins");
      coinsData.current = [];
      console.log("Coins a 0 :" + coinsData.current.length);
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
