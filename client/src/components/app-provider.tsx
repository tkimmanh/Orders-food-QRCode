"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useEffect, useRef } from "react";
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
import { create } from "zustand";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // tắt tự động refetch khi focus vào tab
      // refetchOnMount: false, // tắt tự động refetch khi mount component
    },
  },
});

type AppStoreState = {
  isAuth: boolean;
  role: RoleType | undefined;
  socket: Socket | undefined;
  setRole: (role?: RoleType | undefined) => void;
  setSocket: (socket?: Socket | undefined) => void;
  disconnectSocket: () => void;
};
// 'set' trong zustand sẽ merge object mới vào state cũ
// set({role: 'admin'}) thì state sẽ là {isAuth: true, role: 'admin'}
export const useAppStore = create<AppStoreState>((set) => ({
  isAuth: false,
  role: undefined as RoleType | undefined,
  socket: undefined as Socket | undefined,
  setRole: (role?: RoleType | undefined) => {
    set({ role, isAuth: Boolean(role) });
    if (!role) {
      removeTokenFromLocalStorage();
    }
  },
  setSocket: (socket?: Socket | undefined) => set({ socket }),
  disconnectSocket: () =>
    set((state: any) => {
      state.socket?.disconnect();
      return { socket: undefined };
    }),
}));

export default function AppProvider({ children }: { children: ReactNode }) {
  const { setRole: setRoleState, setSocket } = useAppStore((state) => state);
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

  return (
    <QueryClientProvider client={queryClient}>
      <ListenLogoutSocket />
      {children}
      <RefreshToken />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
