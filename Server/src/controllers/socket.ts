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

    io.on("connect", (socket: ConversationSocket) => {

      socket.on("join-room", (conversationId) => {
        socket.join(conversationId);
      });

      socket.on("send-message", async (message, conversationId) => {
        const savedMessage = await messageService.createMessage(message);
        if (savedMessage.valid) {
          io.to(conversationId ?? "").emit("message", {
            valid: true,
            message: savedMessage.data,
          });
        }
      });
    });
  }
}

export default new SocketService();
