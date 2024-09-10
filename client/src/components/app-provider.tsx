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
  getAccessTokenFormLocalStorage,
  removeTokenFromLocalStorage,
} from "@/lib/utils";

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
  setIsAuth: (_isAuth: boolean) => {},
});

export const useAppContext = () => {
  return useContext(AppContext);
};

export default function AppProvider({ children }: { children: ReactNode }) {
  const [isAuth, setIsAuthState] = useState(false);

  useEffect(() => {
    const accessToken = getAccessTokenFormLocalStorage();
    if (accessToken) {
      setIsAuthState(true);
    }
  }, []);

  const setIsAuth = useCallback((isAuth: boolean) => {
    if (isAuth) {
      setIsAuthState(true);
    } else {
      setIsAuthState(false);
      removeTokenFromLocalStorage();
    }
  }, []);
  return (
    <AppContext.Provider
      value={{
        isAuth,
        setIsAuth,
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
