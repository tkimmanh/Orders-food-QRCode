import { envConfig } from "@/config";
import { io } from "socket.io-client";
import { getAccessTokenFormLocalStorage } from "./utils";

const socket = io(envConfig.NEXT_PUBLIC_API_ENDPOINT, {
  auth: {
    Authorization: `Bearer ${getAccessTokenFormLocalStorage()}`,
  },
});

export default socket;
