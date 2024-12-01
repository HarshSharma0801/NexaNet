import { Server } from "socket.io";

class SocketService {
  private socketIO: Server;

  constructor() {
    console.log("initiating server");
    this.socketIO = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: "*",
      },
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
