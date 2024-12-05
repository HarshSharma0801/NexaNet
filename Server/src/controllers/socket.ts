import { Server, Socket } from "socket.io";
import { createAdapter } from "@socket.io/redis-streams-adapter";
import messageService from "./message";
import redis from "../db/redis.config";

interface ConversationSocket extends Socket {
  conversation?: string;
}

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

    io.use((socket: ConversationSocket, next) => {
      const conversation = socket.handshake.auth.conversation;
      if (!conversation) {
        return next(new Error("conversation must be present"));
      }
      socket.conversation = conversation;
      next();
    });

    io.on("connect", (socket: ConversationSocket) => {
      console.log("New Connection ", socket.id);
      if (socket.conversation) {
        socket.join(socket.conversation);
        socket.on("message", async (message) => {
          const savedMessage = await messageService.createMessage(message);
          if (savedMessage.valid) {
            io.to(socket.conversation ?? "").emit("message", {
              valid: true,
              message: savedMessage.data,
            });
          }
        });
      }
    });
  }
}

export default new SocketService();
