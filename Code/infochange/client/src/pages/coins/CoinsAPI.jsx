import React, { useState, useEffect, useContext, createContext } from "react";

import axios from "axios";

const CoinsContext = createContext();
const SERVER_URL = "http://server.infochange.me:1024";

export const CoinsAPI = ({ children }) => {
  const [coins, setCoins] = useState([]);
  const [lastDate, setLastDate] = useState("");

  const get = async (url) =>
    await axios.get(SERVER_URL + url, { withCredentials: true });

  const getCoins = () => coins;

  const getLastDate = () => lastDate;

  async function getCoinsAPI() {
    const response = await get("/coins");
    setCoins(response.data.coins);
    setLastDate(response.data.last_update);
    return response;
  }

  async function getCoinPrice(symbol) {
    const response = await get("/prices?symbol=" + symbol);
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
  const doGetCoinPrice = async (symbol) =>
    await doAction(() => getCoinPrice(symbol));

  useEffect(() => {
    doGetCoins();

    const interval = setInterval(async () => {
      await doGetCoins();
    }, 120000); // 2 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <CoinsContext.Provider
      value={{ doGetCoins, getCoins, getLastDate, doGetCoinPrice }}
    >
      {children}
    </CoinsContext.Provider>
  );
};

export const useCoins = () => useContext(CoinsContext);
