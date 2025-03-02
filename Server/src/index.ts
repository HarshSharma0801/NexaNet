import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import router from "./router/router";
import http from "http";
import SocketService from "./controllers/socket";
import MediaSoupService from "./controllers/media";
import { PrismaClient } from "@prisma/client";
dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT;
app.get("/", (req: express.Request, res: express.Response) => {
  res.send("its working");
});
app.use(router);

export const prismaDbClient = new PrismaClient();
const server = http.createServer(app);
SocketService.io.attach(server);
server.listen(PORT, () => {
  console.log("server started at ", PORT);
});
SocketService.InitiateSocket();
MediaSoupService.InitiateMediaSoup();
