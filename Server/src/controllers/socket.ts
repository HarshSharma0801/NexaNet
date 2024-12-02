import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-streams-adapter";
import redis from "../db/redis.config";
class SocketService {
  private socketIO: Server;

  constructor() {
    console.log("initiating server");
    this.socketIO = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: "*",
      },
      adapter: createAdapter(redis),
    });
  }

  get io() {
    return this.socketIO;
  }

  public InitiateSocket() {
    const io = this.io;
    io.on("connect", (socket) => {
      console.log("New Connection ", socket.id);
      socket.on("message", async (message) => {
        console.log("new message:", message);
        io.emit("message", message);
      });
    });
  }
}

export default new SocketService();
