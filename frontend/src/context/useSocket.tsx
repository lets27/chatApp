import { createContext, useContext } from "react";
import { Socket } from "socket.io-client";
type OnlineUser = {
  userId: string;
};

export const SocketContext = createContext<{
  socket: Socket | null;
  isConnected: boolean;
  connectSocket: () => void;
  disconnectSocket: () => void;
  onlineUsers: OnlineUser[]; //type of online user
}>({
  socket: null,
  isConnected: false,
  connectSocket: () => {},
  disconnectSocket: () => {},
  onlineUsers: [],
});

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
