import { config } from "../util/config/config";
import mediasoup, { types as mediasoupTypes } from "mediasoup";
import { Participant } from "./participant";
import { Server } from "socket.io";

// const newDominantSpeaker = require("../media-helpers/newDominantSpeaker");

export class Call {
  public worker: mediasoupTypes.Worker;
  public conversatiionId: string;
  public router: mediasoupTypes.Router | null;
  public participants: Participant[];
  public activeSpeakerList: any[];
  public activeSpeakerObserver: any;

  constructor(conversationId: string, worker: mediasoupTypes.Worker) {
    this.conversatiionId = conversationId;
    this.worker = worker;
    this.router = null;

    //participants in the room
    this.participants = [];

    //participants with most dominant speakers
    this.activeSpeakerList = [];
  }

  addParticipant(participant: Participant) {
    this.participants.push(participant);
  }

  createRouter(io: Server): Promise<void> {
    return new Promise(async (resolve, reject) => {
      this.router = await this.worker.createRouter({
        mediaCodecs: [
          {
            kind: "audio",
            mimeType: "audio/opus",
            clockRate: 48000,
            channels: 2,
          },
          {
            kind: "video",
            mimeType: "video/H264",
            clockRate: 90000,
            parameters: {
              "packetization-mode": 1,
              "profile-level-id": "42e01f",
              "level-asymmetry-allowed": 1,
            },
          },
          {
            kind: "video",
            mimeType: "video/VP8",
            clockRate: 90000,
            parameters: {},
          },
        ],
      });
      this.activeSpeakerObserver =
        await this.router.createActiveSpeakerObserver({
          interval: 300, //300 is default
        });
      // this.activeSpeakerObserver.on("dominantspeaker", (ds: any) =>
      //   newDominantSpeaker(ds, this, io)
      // );

      resolve();
    });
  }
}
