"use client";
import { FunctionComponent, ReactElement, useEffect, useState } from "react";
import Chat from "./Chat";
import CallContainer from "../Calls/Call";
import { useParams } from "next/navigation";
import { OngoingCall, CallStatus } from "@/types";
import { useCallContext } from "@/providers/call-provider";

const ChatArea: FunctionComponent = (): ReactElement => {
  const { id } = useParams();
  const { GetCall, OngoingCall, IncomingCall } = useCallContext();
  const [callData, setCallData] = useState<OngoingCall | null>(null);

  const ValidateCall = () => {
    if (id) {
      setCallData(GetCall(id as string));
    }
  };

  useEffect(() => {
    ValidateCall();
  }, [OngoingCall, IncomingCall]);


  return (
    <>
      {callData === null && <Chat id={id as string} callData={null} />}
      {callData && callData.status === CallStatus["incoming"] && (
        <Chat id={id as string} callData={callData} />
      )}
      {callData && callData.status === CallStatus["active"] && (
        <CallContainer callData={callData} />
      )}
    </>
  );
};

export default ChatArea;
