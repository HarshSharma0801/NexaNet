import { Server, Socket } from "socket.io";
import { createAdapter } from "@socket.io/redis-streams-adapter";
import messageService from "./message";
import redis from "../db/redis.config";
import { Participant } from "./participant";
import MediaSoupService from "./media";
import { Call } from "./call";
import { getWorker } from "../util/mediasoup-helpers/getWorkers";
import { updateActiveSpeakers } from "../util/mediasoup-helpers/updateActiveSpeakerList";
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

      socket.on("send-message", async (message, conversationId) => {
        const savedMessage = await messageService.createMessage(message);
        if (savedMessage.valid) {
          io.to(conversationId ?? "").emit("message", {
            valid: true,
            message: savedMessage.data,
          });
        }
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

      socket.on("requestTransport", async ({ type, audioPid }, ackCall) => {
        let participantTransportParams;

        if (this.participant instanceof Participant) {
          if (type === "producer") {
            participantTransportParams = await this.participant.addTransport(
              type
            );
          } else if (type === "consumer") {
            const producingClient = this.participant.call.participants.find(
              (c: any) => c?.producer?.audio?.id === audioPid
            );
            const videoPid = producingClient?.producer?.video?.id;
            participantTransportParams = await this.participant.addTransport(
              type,
              audioPid,
              videoPid
            );
          }
        }
        console.log("request transport callback sent");
        ackCall(participantTransportParams);
      });

      // connect transport event
      socket.on(
        "connectTransport",
        async ({ type, dtlsParameters, audioPid }, ackCall) => {
          if (type === "producer") {
            try {
              if (this.participant instanceof Participant) {
                if (this.participant.upstreamTransport) {
                  await this.participant.upstreamTransport.connect({
                    dtlsParameters,
                  });
                }
                ackCall("success");
              }
            } catch (error) {
              console.log(error);
              ackCall("error");
            }
          } else if (type === "consumer") {
            try {
              if (this.participant instanceof Participant) {
                const downstreamTransport =
                  this.participant.downstreamTransports.find((t: any) => {
                    return t.associatedAudioPid === audioPid;
                  });
                console.log("connecting downstream");
                downstreamTransport.transport.connect({ dtlsParameters });
                ackCall("success");
              }
            } catch (error) {
              console.log(error);
              ackCall("error");
            }
          }
        }
      );

      // producing event
      socket.on("startProducing", async ({ kind, rtpParameters }, ackCall) => {
        try {
          // create a producer
          if (
            this.participant instanceof Participant &&
            this.participant.upstreamTransport
          ) {
            const newProducer =
              await this.participant.upstreamTransport.produce({
                kind,
                rtpParameters,
              });

            this.participant.addProducer(kind, newProducer);
            if (kind === "audio") {
              this.participant.call.activeSpeakerList.push(newProducer.id);
            }
            ackCall(newProducer.id);
          }
        } catch (error) {
          console.log(error);
          ackCall("error");
        }

        if (this.participant instanceof Participant) {
          const newTransportsByPeer = updateActiveSpeakers(
            this.participant.call,
            io
          );

          // newTransportsByPeer is an object, each property is a socket.id that
          // has transports to make. They are in an array, by pid

          console.log(newTransportsByPeer, "getting newTransportsByPeer");
          for (const [socketId, AudioProducerIds] of Object.entries(
            newTransportsByPeer
          )) {
            console.log("in start producing");
            // we have the audioPidsToCreate this socket needs to create
            // map the video pids and the username
            // AudioProducerIds,
            // VideoProducerIds,
            const VideoProducerIds = AudioProducerIds.map((aPid) => {
              if (this.participant instanceof Participant) {
                const producerClient = this.participant.call.participants.find(
                  (c: any) => c?.producer?.audio?.id === aPid
                );
                return producerClient?.producer?.video?.id;
              }
            });
            const AllUserData = AudioProducerIds.map((aPid) => {
              if (this.participant instanceof Participant) {
                const producerClient = this.participant.call.participants.find(
                  (c: any) => c?.producer?.audio?.id === aPid
                );
                return producerClient?.userName;
              }
            });
            io.to(socketId).emit("newProducersToConsume", {
              routerRtpCapabilities:
                this.participant.call.router.rtpCapabilities,
              AudioProducerIds,
              VideoProducerIds,
              AllUserData,
              activeSpeakerList: this.participant.call.activeSpeakerList.slice(
                0,
                5
              ),
            });
          }
        }
      });

      // consume media event
      socket.on(
        "consumeMedia",
        async ({ rtpCapabilities, pid, kind }, ackCall) => {
          // will run twice for every peer to consume ... once for video  , once for audio
          if (this.participant instanceof Participant) {
            try {
              if (
                !this.participant.call.router.canConsume({
                  producerId: pid,
                  rtpCapabilities,
                })
              ) {
                ackCall("consumeFailed");
              } else {
                const downstreamTransport =
                  this.participant.downstreamTransports.find((t: any) => {
                    if (kind === "audio") {
                      return t.associatedAudioPid === pid;
                    } else if (kind === "video") {
                      return t.associatedVideoPid === pid;
                    }
                  });

                // after getting the transport create consumer to consume
                const newConsumer = await downstreamTransport.transport.consume(
                  {
                    producerId: pid,
                    rtpCapabilities,
                    paused: true, //good practice
                  }
                );

                // add this newCOnsumer to the CLient
                this.participant.addConsumer(
                  kind,
                  newConsumer,
                  downstreamTransport
                );

                // respond with the params
                const clientParams = {
                  producerId: pid,
                  id: newConsumer.id,
                  kind: newConsumer.kind,
                  rtpParameters: newConsumer.rtpParameters,
                };

                ackCall(clientParams);
              }
            } catch (error) {
              console.log(error);
              ackCall("consumeFailed");
            }
          }
        }
      );

      // unpause consumer event
      socket.on("unpauseConsumer", async ({ pid, kind }, ackCall) => {
        if (this.participant instanceof Participant) {
          const consumerToResume = this.participant.downstreamTransports.find(
            (t: any) => {
              return t?.[kind].producerId === pid;
            }
          );
          await consumerToResume[kind].resume();
          ackCall();
        }
      });
    });
  }
}

export default new SocketService();
