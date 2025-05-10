import { io, Socket } from "socket.io-client";
import useUserContext from "./useUser";
import { useEffect, useRef, useState } from "react";
import { SocketContext } from "./useSocket";

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUserContext();
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<{ userId: string }[]>([]);

  // Cleanup on unmount
  useEffect(() => {
    return () => disconnectSocket();
  }, []);

  // Handle user changes
  useEffect(() => {
    if (user) {
      connectSocket();
    } else {
      disconnectSocket();
    }

    return () => disconnectSocket();
  }, [user]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    const handleOnlineUsers = (updatedUsers: string[]) => {
      setOnlineUsers(updatedUsers.map((id) => ({ userId: id })));
    };

    socket.on("OnlineUsers", handleOnlineUsers);
    socket.on("userOffline", handleOnlineUsers); // Add this line

    return () => {
      socket.off("OnlineUsers", handleOnlineUsers);
      socket.off("userOffline", handleOnlineUsers);
    };
  }, [socket]);

  const connectSocket = () => {
    if (!user || socketRef.current?.connected) return;

    const token = localStorage.getItem("chatToke");
    const newSocket = io("http://localhost:3000", {
      auth: { token },
      query: { userId: user._id },
      autoConnect: true,
      reconnection: false, // Disable automatic reconnection
    });

    newSocket.on("connect", () => {
      setIsConnected(true);
      console.log("✅ Socket connected");
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
      console.log("❌ Socket disconnected");
    });

    socketRef.current = newSocket;
    setSocket(newSocket);
  };

  const disconnectSocket = () => {
    if (socketRef.current) {
      console.log("Disconnecting socket...");
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
      socketRef.current = null;
      setSocket(null);
      setIsConnected(false);
      setOnlineUsers([]);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        onlineUsers,
        connectSocket,
        disconnectSocket,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
