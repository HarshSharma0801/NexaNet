"use client";

import React, { createContext, ReactNode, useContext, useState } from "react";
import { io, Socket } from "socket.io-client";

interface ISocket {
  socket: Socket | null;
  socketConnect: () => void;
  socketJoin: (id: string) => void;
}

const SocketContext = createContext<ISocket | null>(null);

export const SocketProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  const socketConnect = () => {
    const socket = io("http://localhost:7070", { autoConnect: true });
    if (socket) {
      setSocket(socket);
    }
  };

  const socketJoin = (id: string) => {
    socket?.emitWithAck("join-room" , id);
  };

  return (
    <SocketContext.Provider value={{ socket, socketConnect, socketJoin }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = (): ISocket => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
