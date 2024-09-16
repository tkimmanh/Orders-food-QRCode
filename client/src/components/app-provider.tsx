"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import RefreshToken from "./refresh-token";
import {
  decodeToken,
  getAccessTokenFormLocalStorage,
  removeTokenFromLocalStorage,
} from "@/lib/utils";

import { RoleType } from "@/types/jwt.types";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // tắt tự động refetch khi focus vào tab
      refetchOnMount: false, // tắt tự động refetch khi mount component
    },
  },
});

const AppContext = createContext({
  isAuth: false,
  role: undefined as RoleType | undefined,
  setRole: (role?: RoleType | undefined) => {},
});

export const useAppContext = () => {
  return useContext(AppContext);
};

export default function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<RoleType | undefined>(undefined);

  useEffect(() => {
    const accessToken = getAccessTokenFormLocalStorage();
    if (accessToken) {
      const role = decodeToken(accessToken).role;
      setRoleState(role);
    }
  }, []);

  const setRole = useCallback((role: RoleType | undefined) => {
    setRoleState(role);
    if (!role) {
      removeTokenFromLocalStorage();
    }
  }, []);
  const isAuth = Boolean(role);
  return (
    <AppContext.Provider
      value={{
        isAuth,
        role,
        setRole,
      }}
    >
      <QueryClientProvider client={queryClient}>
        {children}
        <RefreshToken />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AppContext.Provider>
  );
}
