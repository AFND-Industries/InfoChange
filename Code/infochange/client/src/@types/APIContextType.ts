// @types.APIContextType.ts

import { AxiosResponse } from "axios";
import { Cart, PaymentResponse } from "./payment";

export interface APIContextType {
    buyProduct: (buy: Cart) => Promise<AxiosResponse<PaymentResponse>>,
    doTradeHistory,
    doTrade,
    doBizum,
    getPair,
    getPairPrice,
    getTokenInfo,
    filterPairs,
}