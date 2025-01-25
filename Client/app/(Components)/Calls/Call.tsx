"use client";

import { OngoingCall } from "@/types";
import { FunctionComponent, ReactElement, useEffect, useRef } from "react";
import { MdCallEnd } from "react-icons/md";
import { FaVideo } from "react-icons/fa6";
import { IoIosMic } from "react-icons/io";
import { useCallContext } from "@/providers/call-provider";

const CallContainer: FunctionComponent<{ callData: OngoingCall }> = ({
  callData,
}): ReactElement => {
  const { HangCall, Participants, localstream } = useCallContext(); // Use destructuring once to avoid multiple calls

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && localstream) {
      videoRef.current.srcObject = localstream;
    }
  }, [localstream]);

  const EndCall = () => {
    HangCall(callData); // Ensure this doesn’t trigger a re-render during render phase
  };


  useEffect(() => {
    if (Participants.length > 0) {
      Participants.forEach((data: any) => {
        const videoElement = document.querySelector(`#video-${data.id}`);
        if (videoElement && data.combinedStream) {
          (videoElement as HTMLVideoElement).srcObject = data.combinedStream;
        }
      });
    }
  }, [Participants]);
  

  return (
    <div className="w-full flex flex-[1] md:flex-[0.7] flex-col py-2 md:p-4 md:pl-0 gap-2 relative">
      <div className="flex justify-center flex-col  gap-4 md:mr-0 mr-[6px] h-screen text-white bg-primarylightPurple rounded-2xl p-3 md:p-3 text-[13px] md:text-[1rem]">
        {Participants.length > 0 &&
          Participants.map((data: any) => (
            <div
              key={data.id || data.username} // Use a unique identifier
              className="flex flex-col gap-5 justify-center w-full items-center"
            >
              <video
                id={`video-${data.id}`}
                className="rounded border w-full"
                autoPlay
                playsInline
              />
              {data.username}
            </div>
          ))}
        <div className="flex flex-col gap-5 justify-center w-full items-center">
          {/* Local Video */}
          <video
            ref={videoRef}
            className="rounded border w-full"
            autoPlay
            playsInline
          />
          {callData.caller.username}
          <div className="flex justify-center gap-3">
            <button className="md:w-[80px] bg-primaryDark items-center flex justify-center p-2 text-white rounded-xl">
              <FaVideo className="w-4 md:w-7 h-4 md:h-7" />
            </button>
            <button className="md:w-[80px] bg-primaryDark items-center flex justify-center p-2 text-white rounded-xl">
              <IoIosMic className="w-4 md:w-7 h-4 md:h-7" />
            </button>
            <button
              onClick={EndCall}
              className="md:w-[80px] bg-red-500 items-center flex justify-center p-2 text-white rounded-xl"
            >
              <MdCallEnd className="w-4 md:w-7 h-4 md:h-7" />
            </button>
          </div>
        </div>

        {/* Participants' Videos */}
      </div>
    </div>
  );
};

export default CallContainer;
