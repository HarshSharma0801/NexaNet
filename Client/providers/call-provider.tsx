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

interface ICall {
  IncomingCall: OngoingCall | null;
  OngoingCall: OngoingCall | null;
  GetCall: (id: string) => OngoingCall | null;
  DialCall: (callData: OngoingCall) => void;
  HangCall: (callData: OngoingCall) => void;
}

const CallContext = createContext<ICall | null>(null);

export const CallProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { socket } = useSocketContext();
  const [OngoingCall, setOngoingCall] = useState<OngoingCall | null>(null);
  const [IncomingCall, setIncomingCall] = useState<OngoingCall | null>(null);

  useEffect(() => {
    socket?.on("incoming-call", (callData: OngoingCall) => {
      if (OngoingCall === null) {
        setIncomingCall(callData);
      }
    });

    return () => {
      socket?.off("incoming-call");
    };
  }, [socket]);

  const GetCall = (id: string) => {
    return OngoingCall?.conversatiionId === id ? OngoingCall : null;
  };

  const DialCall = async (callData: OngoingCall) => {
    setOngoingCall(callData);

    if (socket?.connected) {
      try {
        const res = await socket.timeout(10000).emitWithAck("join-call", callData);
        console.log("Response from server:", res);
        const device = new Device();
        await device.load({
          routerRtpCapabilities: res.routerRtpCapabilities,
        });
        console.log("Device : ", device);
      } catch (err) {
        console.error("err:", err);
      }
    } else {
      console.error("Socket is not connected.");
    }
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
        HangCall,
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
