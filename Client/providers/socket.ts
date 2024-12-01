import { io, Socket } from "socket.io-client";

let socket: Socket;

export const getSocket = (): Socket => {
  socket = io("http://localhost:7070", { autoConnect: false });
  console.log("in sokcet");
  return socket;
};
