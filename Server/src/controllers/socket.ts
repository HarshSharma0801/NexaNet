import { Server, Socket } from "socket.io";
import { createAdapter } from "@socket.io/redis-streams-adapter";
import messageService from "./message";
import redis from "../db/redis.config";
import { Participant } from "./participant";
import MediaSoupService from "./media";
import { Call } from "./call";
import { getWorker } from "../util/mediasoup-helpers/getWorkers";
import mediasoup, { types as mediasoupTypes } from "mediasoup";

interface ConversationSocket extends Socket {
  conversation?: string;
}

class SocketService {
  private socketIO: Server;

  public participant: Participant | {};

  public calls: Call[];

  constructor() {
    console.log("initiating socket server");
    this.socketIO = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: "*",
      },
      adapter: createAdapter(redis),
    });

    this.participant = {};
    this.calls = [];
  }

  get io() {
    return this.socketIO;
  }

  public InitiateSocket() {
    const io = this.io;

    io.on("connect", (socket: ConversationSocket) => {
      console.log("New Connection :", socket.id);

      socket.on("join-room", (conversationId) => {
        socket.join(conversationId);
      });

      socket.on("join-call", async (callData, callback) => {
       
        try {
          this.participant = new Participant(callData, socket.id);

          let requestedCall = this.calls.find(
            (data: any) => data.conversatiionId === callData.conversatiionId
          );

          if (!requestedCall) {
            const workerToUse = (await getWorker(
              MediaSoupService.workers
            )) as mediasoupTypes.Worker;
            requestedCall = new Call(callData.conversatiionId, workerToUse);
            await requestedCall.createRouter(io);
            this.calls.push(requestedCall);
          }

          if (this.participant instanceof Participant) {
         
            this.participant.call = requestedCall;
            this.participant.call.addParticipant(this.participant);

            const AudioProducerIds =
              this.participant.call.activeSpeakerList.slice(0, 5);
          

            const VideoProducerIds = AudioProducerIds.map((aid: any) => {
              if (this.participant instanceof Participant) {
                const producingParticipant = this.participant.call.clients.find(
                  (c: any) => c?.producer?.audio?.id === aid
                );
                return producingParticipant?.producer?.video?.id;
              }
            });
           
            const AllUserData = AudioProducerIds.map((aid: any) => {
              if (this.participant instanceof Participant) {
                const producingParticipant =
                  this.participant.call.participants.find(
                    (c: any) => c?.producer?.audio?.id === aid
                  );
                return producingParticipant?.participantData;
              }
            });

            callback({
              routerRtpCapabilities:
                this.participant.call.router.rtpCapabilities,
              AudioProducerIds,
              VideoProducerIds,
              AllUserData,
            });
            console.log("Callback sent successfully");
          } else {
            console.error("Participant is invalid");
            callback({ error: "Invalid participant" });
          }
        } catch (error) {
          console.error("Error in join-call:", error);
          callback({ error: error });
        }
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
