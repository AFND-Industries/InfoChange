import { useQuery } from "@tanstack/react-query";

import { endpoints } from "../lib/endpoints";
import { queryKeys } from "../lib/query-client";

export function useTradeHistory(enabled = true) {
  return useQuery({
    queryKey: queryKeys.tradeHistory,
    queryFn: () => endpoints.history.trades(),
    select: (data) => data.trades,
    enabled,
  });
}

export function usePaymentHistory(enabled = true) {
  return useQuery({
    queryKey: queryKeys.paymentHistory,
    queryFn: () => endpoints.history.payments(),
    select: (data) => data.payments,
    enabled,
  });
}

export function useTransferHistory(enabled = true) {
  return useQuery({
    queryKey: queryKeys.transferHistory,
    queryFn: () => endpoints.history.transfers(),
    select: (data) => data.transfers,
    enabled,
    // Se consulta cada minuto para poder avisar de una transferencia recibida.
    // Antes esto se resolvia pidiendo el historial entero cada cinco segundos.
    refetchInterval: 60_000,
  });
}

export function useAdminOverview(enabled = true) {
  return useQuery({
    queryKey: queryKeys.adminOverview,
    queryFn: () => endpoints.admin.overview(),
    enabled,
    refetchInterval: 30_000,
  });
}
