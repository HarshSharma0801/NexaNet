import { Socket } from "socket.io";
import { config } from "../util/config/config";
import { types } from "mediasoup";

export class Participant {
  public participantData: any;
  public socket: string;
  public upstreamTransport: types.WebRtcTransport | null;
  public downstreamTransports: any;
  public producer: {
    [key: string]: any;
  };
  public call: any;

  constructor(callerData: any, socket: string) {
    this.participantData = callerData;

    this.socket = socket;

    this.upstreamTransport = null;

    this.producer = {};
    this.downstreamTransports = [];

    this.call = null;
  }

  addTransport(type: string, audioPid = null, videoPid = null) {
    return new Promise(async (resolve, reject) => {
      const { listenIps, initialAvailableOutgoingBitrate, maxIncomingBitrate } =
        config.webRtcTransport;

      const transport = await this.call.router.createWebRtcTransport({
        enableUdp: true,
        enableTcp: true, //always use UDP unless we can't
        preferUdp: true,
        listenInfos: listenIps,
        initialAvailableOutgoingBitrate,
      });

      if (maxIncomingBitrate) {
        try {
          await transport.setMaxIncomingBitrate(maxIncomingBitrate);
        } catch (err) {
          console.log("Error setting bitrate");
          console.log(err);
        }
      }

      const clientTransportParams = {
        id: transport.id,
        iceParameters: transport.iceParameters,
        iceCandidates: transport.iceCandidates,
        dtlsParameters: transport.dtlsParameters,
      };

      if (type === "producer") {
        this.upstreamTransport = transport;
      } else if (type === "consumer") {
        this.downstreamTransports.push({
          transport, //will handle both audio and video
          associatedVideoPid: videoPid,
          associatedAudioPid: audioPid,
        });
      }

      resolve(clientTransportParams);
    });
  }

  addProducer(kind: string, newProducer: any) {
    this.producer[kind] = newProducer;

    if (kind === "audio") {
      // add this to our activeSpeakerObserver
      this.call.activeSpeakerObserver.addProducer({
        producerId: newProducer.id,
      });
    }
  }

  addConsumer(kind: string, newConsumer: any, downstreamTransport: any) {
    downstreamTransport[kind] = newConsumer;
  }
}
