import React, { useEffect, useRef, useState } from "react";
import CoinsCap from "../../data/CoinMarketCapData.json";
import Symbols from "../../data/Coins.json";
import Data from "../../data/Data.json";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Button } from "primereact/button";
import "primeicons/primeicons.css";
import "./row.css";
import { Timeline } from "react-ts-tradingview-widgets";
import CoinInfo from "./CoinInfo";
import { useLocation } from "react-router-dom";

import { CoinsAPI, useCoins } from "./CoinsAPI";
import CoinsPage from "./CoinsPage";

export default function Coins() {
  return (
    <CoinsPage />
  );
}
