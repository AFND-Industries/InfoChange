// @types.APIContextType.ts

import { AxiosResponse } from "axios";
import { Cart, PaymentResponse } from "./payment";

export interface APIContextType {
    buyProduct: (buy: Cart, method: string) => Promise<AxiosResponse<PaymentResponse>>,
    withdrawBalance: (buy: Cart, method: string) => Promise<AxiosResponse<PaymentResponse>>,
    doTradeHistory,
    doPaymentHistory,
    doBizumHistory,
    doBizumUsers,
    doTrade,
    doBizum,
    doSwap,
    getPair,
    getPairPrice,
    getTokenInfo,
    filterPairs,
}