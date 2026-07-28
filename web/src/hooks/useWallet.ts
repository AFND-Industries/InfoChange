import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { endpoints, type PaymentMethod } from "../lib/endpoints";
import { queryKeys } from "../lib/query-client";

export function useBalances() {
  return useQuery({
    queryKey: queryKeys.balances,
    queryFn: () => endpoints.wallet.balances(),
    select: (data) => data.balances,
  });
}

export function useRecipients(query: string) {
  return useQuery({
    queryKey: queryKeys.recipients(query),
    queryFn: () => endpoints.wallet.recipients(query),
    select: (data) => data.recipients,
    // Se conserva el listado anterior mientras se busca, para que la lista no
    // parpadee con cada tecla.
    placeholderData: (previous) => previous,
  });
}

/**
 * Toda operacion que mueve saldo invalida las mismas consultas. Antes cada
 * componente llamaba a `doAuth()` a mano despues de operar, y era facil
 * olvidarse y dejar la interfaz mostrando un saldo antiguo.
 */
function useBalanceMutation<TArgs, TResult>(
  mutationFn: (args: TArgs) => Promise<TResult>,
  extraKeys: readonly (readonly unknown[])[] = [],
) {
  const client = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      const keys = [queryKeys.session, queryKeys.balances, ...extraKeys];
      for (const queryKey of keys) client.invalidateQueries({ queryKey });
    },
  });
}

export function useTrade() {
  return useBalanceMutation(
    ({
      symbol,
      quantity,
      side,
    }: {
      symbol: string;
      quantity: string;
      side: "BUY" | "SELL";
    }) => endpoints.wallet.trade(symbol, quantity, side),
    [queryKeys.tradeHistory],
  );
}

export function useTransfer() {
  return useBalanceMutation(
    ({ recipientId, amount }: { recipientId: number; amount: string }) =>
      endpoints.wallet.transfer(recipientId, amount),
    [queryKeys.transferHistory],
  );
}

export function useDeposit() {
  return useBalanceMutation(
    ({ amount, method }: { amount: string; method: PaymentMethod }) =>
      endpoints.wallet.deposit(amount, method),
    [queryKeys.paymentHistory],
  );
}

export function useWithdraw() {
  return useBalanceMutation(
    ({ amount, method }: { amount: string; method: PaymentMethod }) =>
      endpoints.wallet.withdraw(amount, method),
    [queryKeys.paymentHistory],
  );
}
