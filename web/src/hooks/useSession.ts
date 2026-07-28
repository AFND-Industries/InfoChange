import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { endpoints, type RegisterInput, type Session } from "../lib/endpoints";
import { queryKeys } from "../lib/query-client";

export type AuthStatus = "loading" | "anonymous" | "authenticated" | "offline";

export interface AuthState {
  status: AuthStatus;
  session: Session | null;
  user: Session["user"] | null;
  balances: Session["balances"];
  isAdmin: boolean;
}

/**
 * Estado de sesion derivado de una unica consulta. La version anterior guardaba
 * el estado en una cadena ("-2", "-1", "0", "1") y confundia cualquier error con
 * "servidor caido": un 500 puntual cerraba la sesion en la interfaz.
 */
export function useSession(): AuthState {
  const query = useQuery({
    queryKey: queryKeys.session,
    queryFn: () => endpoints.auth.me(),
    staleTime: 60_000,
  });

  /**
   * Solo hay tres desenlaces y ninguno depende de que la consulta este
   * refrescandose: mientras haya datos, el estado no cambia.
   *
   * Es importante que un refresco en segundo plano no vuelva a "loading": los
   * guardias de ruta desmontan la pantalla mientras carga, y si eso ocurriese en
   * cada refresco el subarbol se montaria y desmontaria sin parar, pidiendo la
   * sesion en bucle.
   */
  const status: AuthStatus = (() => {
    if (query.data) return query.data.user ? "authenticated" : "anonymous";
    if (query.error) return "offline";
    return "loading";
  })();

  return {
    status,
    session: query.data?.user ? (query.data as Session) : null,
    user: query.data?.user ?? null,
    balances: query.data?.balances ?? [],
    isAdmin: query.data?.user?.role === "admin",
  };
}

export function useLogin() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      endpoints.auth.login(username, password),
    onSuccess: (session) => {
      client.setQueryData(queryKeys.session, session);
      client.invalidateQueries({ queryKey: queryKeys.balances });
    },
  });
}

export function useRegister() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (input: RegisterInput) => endpoints.auth.register(input),
    onSuccess: (session) => client.setQueryData(queryKeys.session, session),
  });
}

export function useLogout() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: () => endpoints.auth.logout(),
    onSuccess: () => {
      // Se vacia toda la cache: los datos del usuario anterior no deben
      // quedarse en memoria para el siguiente.
      client.clear();
    },
  });
}

export function useToggleUiMode() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: () => endpoints.auth.toggleUiMode(),
    onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.session }),
  });
}

export function useSecurityQuestions() {
  return useQuery({
    queryKey: ["auth", "security-questions"],
    queryFn: () => endpoints.auth.securityQuestions(),
    staleTime: Infinity,
    select: (data) => data.questions,
  });
}
