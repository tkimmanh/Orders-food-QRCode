"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import RefreshToken from "./refresh-token";
import {
  decodeToken,
  generateSocketInstance,
  getAccessTokenFormLocalStorage,
  removeTokenFromLocalStorage,
} from "@/lib/utils";

import { RoleType } from "@/types/jwt.types";
import type { Socket } from "socket.io-client";
import ListenLogoutSocket from "./listen-logout-websoket";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // tắt tự động refetch khi focus vào tab
      // refetchOnMount: false, // tắt tự động refetch khi mount component
    },
  },
});

const AppContext = createContext({
  isAuth: false,
  role: undefined as RoleType | undefined,
  setRole: (role?: RoleType | undefined) => {},
  socket: undefined as Socket | undefined,
  setSocket: (socket?: Socket | undefined) => {},
  disconnectSocket: () => {},
});

export const useAppContext = () => {
  return useContext(AppContext);
};

export default function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<RoleType | undefined>(undefined);
  const [socket, setSocket] = useState<Socket | undefined>(undefined);
  const count = useRef(0);
  useEffect(() => {
    if (count.current === 0) {
      const accessToken = getAccessTokenFormLocalStorage();
      if (accessToken) {
        const role = decodeToken(accessToken).role;
        setRoleState(role);
        setSocket(generateSocketInstance(accessToken));
      }
      count.current += 1;
    }
  }, []);

  const setRole = useCallback((role: RoleType | undefined) => {
    setRoleState(role);
    if (!role) {
      removeTokenFromLocalStorage();
    }
  }, []);

  const disconnectSocket = useCallback(() => {
    if (socket) {
      socket.disconnect();
      setSocket(undefined);
    }
  }, [socket, setSocket]);

  const isAuth = Boolean(role);
  return (
    <AppContext.Provider
      value={{
        disconnectSocket,
        socket,
        setSocket,
        isAuth,
        role,
        setRole,
      }}
    >
      <QueryClientProvider client={queryClient}>
        <ListenLogoutSocket />
        {children}
        <RefreshToken />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AppContext.Provider>
  );
}
