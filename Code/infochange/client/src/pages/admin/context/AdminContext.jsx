import React, { createContext, useContext, useState, useEffect } from "react";

import axios from "axios";
import { useAPI } from "../../../context/APIContext";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const { getPair, getPairPrice, getTokenInfo } = useAPI();
  const [adminInfo, setAdminInfo] = useState(undefined);

  const reloadTime = 10000; // 10s

  const findUserById = (ID) =>
    adminInfo !== undefined
      ? Object.values(adminInfo.users).filter((user) => user.ID == ID)[0]
      : undefined;

  useEffect(() => {
    const loadPrices = async () => {
      try {
        const response = await axios.get("https://64.225.102.165/admin", {
          withCredentials: true,
        });
        console.log(response.data.info);

        setAdminInfo(
          response.data.status === "1" ? response.data.info : undefined
        );
      } catch (error) {
        console.error("Error fetching admin info:", error);

        setAdminInfo(undefined);
      }
    };

    loadPrices();

    const intervalId = setInterval(() => {
      loadPrices();
    }, reloadTime);

    return () => clearInterval(intervalId);
  }, []);

  const getTotalUserBalance = (ID) => {
    let totalBalance = 0;

    const userCoins = adminInfo.wallets.filter((wallet) => wallet.user === ID);

    userCoins.forEach((wallet) => {
      const pairPrice =
        wallet.coin === "USDT" ? 1 : getPairPrice(wallet.coin + "USDT");
      totalBalance += wallet.quantity * pairPrice;
    });

    return totalBalance;
  };

  const getTotalUsers = () =>
    adminInfo === undefined ? -1 : adminInfo.users.length;
  const getTotalTransactions = () =>
    adminInfo === undefined ? -1 : adminInfo.trade_history.length;
  const getTotalComission = () => {
    let totalComission = 0;
    if (adminInfo !== undefined) {
      adminInfo.trade_history.forEach((trade) => {
        const symbol = getPair(trade.symbol);
        totalComission +=
          trade.comission *
          (trade.type === "SELL"
            ? getPairPrice(symbol.baseAsset + "USDT")
            : symbol.quoteAsset === "USDT"
            ? 1
            : getPairPrice(symbol.quoteAsset + "USDT"));
      });
    }

    return totalComission;
  };
  const getTotalExchangeBalance = () => {
    let totalExchangeBalance = 0;
    if (adminInfo !== undefined) {
      adminInfo.users.forEach((user) => {
        totalExchangeBalance += getTotalUserBalance(user.ID);
      });
    }

    return totalExchangeBalance;
  };

  const getUsersSortedByBalance = () => {
    let usersByBalance = [];
    if (adminInfo !== undefined) {
      usersByBalance = adminInfo.users
        .map((user) => ({
          ...user,
          totalBalance: getTotalUserBalance(user.ID),
        }))
        .sort((a, b) => b.totalBalance - a.totalBalance)
        .slice(0, 5);
    }

    return usersByBalance;
  };

  const getCoinsSortedByExchangeVolume = () => {
    const volumeMap = {};

    if (adminInfo !== undefined) {
      adminInfo.trade_history.forEach((trade) => {
        const symbol = getPair(trade.symbol);

        if (!volumeMap[symbol.baseAsset]) {
          volumeMap[symbol.baseAsset] = {
            symbol: symbol.baseAsset,
            name: symbol.baseAssetName,
            logo: getTokenInfo(symbol.baseAsset).logo,
            volume: 0,
            dolar_volume: 0,
          };
        }

        if (!volumeMap[symbol.quoteAsset]) {
          volumeMap[symbol.quoteAsset] = {
            symbol: symbol.quoteAsset,
            name: symbol.quoteAssetName,
            logo: getTokenInfo(symbol.quoteAsset).logo,
            volume: 0,
            dolar_volume: 0,
          };
        }

        volumeMap[symbol.baseAsset].volume +=
          trade.type === "BUY" ? trade.amount_received : trade.paid_amount;
        volumeMap[symbol.baseAsset].dolar_volume =
          volumeMap[symbol.baseAsset].volume *
          (symbol.baseAsset === "USDT"
            ? 1
            : getPairPrice(symbol.baseAsset + "USDT"));

        volumeMap[symbol.quoteAsset].volume +=
          trade.type === "BUY" ? trade.paid_amount : trade.amount_received;
        volumeMap[symbol.quoteAsset].dolar_volume =
          volumeMap[symbol.quoteAsset].volume *
          (symbol.quoteAsset === "USDT"
            ? 1
            : getPairPrice(symbol.quoteAsset + "USDT"));
      });
    }

    let volumeList = Object.values(volumeMap);
    volumeList.sort((a, b) => b.dolar_volume - a.dolar_volume);
    volumeList = volumeList.slice(0, 5);

    return volumeList;
  };

  const getBizumHistorySortedByDate = () => {
    let bizumHistory = [];

    if (adminInfo !== undefined) {
      bizumHistory = adminInfo.bizum_history
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5)
        .map((bizum) => {
          const sender = findUserById(bizum.sender);
          const receiver = findUserById(bizum.receiver);

          return {
            sender: sender,
            receiver: receiver,
            bizum: bizum,
          };
        });
    }

    return bizumHistory;
  };

  const getPaymentHistorySortedByDate = () => {
    let paymentHistory = [];

    if (adminInfo !== undefined) {
      paymentHistory = adminInfo.payment_history
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5)
        .map((payment) => {
          const user = findUserById(payment.user);

          return {
            ID: payment.id,
            user: user,
            type: payment.type,
            method: payment.method,
            info: payment.info,
            quantity: payment.quantity,
            date: payment.date,
          };
        });
    }

    return paymentHistory;
  };

  return (
    <AdminContext.Provider
      value={{
        getTotalUserBalance,
        getTotalUsers,
        getBizumHistorySortedByDate,
        getTotalTransactions,
        getTotalComission,
        getTotalExchangeBalance,
        getUsersSortedByBalance,
        getCoinsSortedByExchangeVolume,
        getPaymentHistorySortedByDate,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
