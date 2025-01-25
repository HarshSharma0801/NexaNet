"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useSocketContext } from "./socket-provider";
import { OngoingCall } from "@/types";
import { Device } from "mediasoup-client";
import requestTransportToConsume from "@/util/media-helpers/requestTransportToConsume";
import createProducerTransport from "@/util/media-helpers/createProducerTransport";
import createProducer from "@/util/media-helpers/createProducer";

interface ICall {
  IncomingCall: OngoingCall | null;
  OngoingCall: OngoingCall | null;
  GetCall: (id: string) => OngoingCall | null;
  DialCall: (callData: OngoingCall) => void;
  JoinCall: (callData: OngoingCall) => void;
  HangCall: (callData: OngoingCall) => void;
  localstream: MediaStream | null;
  Participants: any;
}

const CallContext = createContext<ICall | null>(null);

export const CallProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { socket } = useSocketContext();
  const [OngoingCall, setOngoingCall] = useState<OngoingCall | null>(null);
  const [IncomingCall, setIncomingCall] = useState<OngoingCall | null>(null);
  const [localstream, SetLocalStream] = useState<MediaStream | null>(null);
  const [MediaDevice, setMediaDevice] = useState<Device | null>(null);
  const [Participants, setParticipants] = useState<any>([]);

  const AddParticipant = (participant: any) => {
    console.log("in the add User Function");
    setParticipants((prev: any) => {
      console.log(prev, "prev");
      return [participant, ...prev];
    });
  };

  const GetCall = (id: string) => {
    if (OngoingCall !== null) {
      return OngoingCall?.conversatiionId === id ? OngoingCall : null;
    }
    if (IncomingCall !== null) {
      return IncomingCall?.conversatiionId === id ? IncomingCall : null;
    }
    return null;
  };

  useEffect(() => {
    socket?.on("incoming-call", (callData: OngoingCall) => {
      console.log(callData, "notify-call");
      if (OngoingCall === null) {
        setIncomingCall(callData);
      }
    });

    return () => {
      socket?.off("incoming-call");
    };
  }, [socket]);

  useEffect(() => {
    socket?.on("newProducersToConsume", (consumeData) => {
      console.log("newProducersToConsume....!!");
      console.log(MediaDevice, "device in this file");
      if (MediaDevice) {
        requestTransportToConsume(
          consumeData,
          socket,
          MediaDevice,
          AddParticipant
        );
      }
    });

    return () => {
      socket?.off("newProducersToConsume");
    };
  }, [socket, MediaDevice]);

  const DialCall = async (callData: OngoingCall) => {
    console.log(socket?.connected);
    if (socket?.connected) {
      try {
        const res = await socket.emitWithAck("join-call", callData);
        console.log("Response from server:", res);
        const device = new Device();
        await device.load({
          routerRtpCapabilities: res.routerRtpCapabilities,
        });
        setMediaDevice(device);
        requestTransportToConsume(res, socket, device, AddParticipant);
        const stream = await GetUserFeed();

        if (stream) {
          SendFeed(device, stream, callData);
          socket?.emit("notify-call", {
            ...callData,
            status: 0,
          });
        }
      } catch (err) {
        console.error("err:", err);
      }
    } else {
      console.error("Socket is not connected.");
    }
  };

  const JoinCall = async (callData: OngoingCall) => {
    console.log(socket?.connected);
    if (socket?.connected) {
      try {
        const res = await socket.emitWithAck("join-call", callData);
        console.log("Response from server:", res);
        const device = new Device();
        await device.load({
          routerRtpCapabilities: res.routerRtpCapabilities,
        });
        console.log(device);
        requestTransportToConsume(res, socket, device, AddParticipant);
        const stream = await GetUserFeed();

        if (stream) {
          SendFeed(device, stream, callData);
        }
      } catch (err) {
        console.error("err:", err);
      }
    } else {
      console.error("Socket is not connected.");
    }
  };

  const GetUserFeed = async () => {
    try {
      // Request media permissions
      const newStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
          width: { min: 640, ideal: 1280, max: 1920 },
          height: { min: 360, ideal: 720, max: 1080 },
          frameRate: { min: 16, ideal: 30, max: 30 },
        },
      });
      SetLocalStream(newStream);
      return newStream;
    } catch (error) {
      console.error("Error accessing user media:", error);
    }
  };

  const SendFeed = async (device: any, stream: MediaStream, callData: any) => {
    const producerTransport = await createProducerTransport(socket, device);

    console.log(producerTransport);

    const producers = await createProducer(stream, producerTransport);
    console.log(producers, "Producers");
    setOngoingCall(callData);
  };
  const HangCall = (callData: OngoingCall) => {
    setOngoingCall(null);

    //event ....
  };

  return (
    <CallContext.Provider
      value={{
        OngoingCall,
        GetCall,
        IncomingCall,
        DialCall,
        JoinCall,
        HangCall,
        localstream,
        Participants,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};

export const useCallContext = (): ICall => {
  const context = useContext(CallContext);
  if (!context)
    throw new Error("useCallContext must be used within a CallProvider");
  return context;
};
