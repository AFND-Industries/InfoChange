// @types.APIContextType.ts

import { AxiosResponse } from "axios";
import { Cart } from "./payment";

export interface APIContextType {
    buyProduct: (buy: Cart) => Promise<AxiosResponse<any>>,
    doTradeHistory,
    doTrade,
    getPair,
    getPairPrice,
    getTokenInfo,
    filterPairs,
}