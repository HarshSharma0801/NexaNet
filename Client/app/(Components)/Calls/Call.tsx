"use client";

import { OngoingCall } from "@/types";
import { FunctionComponent, ReactElement } from "react";
import { MdCallEnd } from "react-icons/md";
import { FaVideoSlash } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import { IoIosMic } from "react-icons/io";
import { IoIosMicOff } from "react-icons/io";
import { useCallContext } from "@/providers/call-provider";

const CallContainer: FunctionComponent<{ callData: OngoingCall }> = ({
  callData,
}): ReactElement => {
  const { HangCall } = useCallContext();

  const EndCall = () => {
    HangCall(callData);
  };

  return (
    <>
      <div className="w-full flex flex-[1] md:flex-[0.7] flex-col py-2 md:p-4 md:pl-0 gap-2 relative">
        <div className="flex justify-center gap-2 md:mr-0 mr-[6px] h-screen text-white  bg-primarylightPurple rounded-2xl p-3 md:p-3 text-[13px] md:text-[1rem]">
          <div className="flex flex-col gap-5 justify-center w-full items-center">
            {callData.caller.username}
            <div className="flex justify-center gap-3">
              <button className="md:w-[80px]  bg-primaryDark items-center flex justify-center p-2 text-white rounded-xl">
                <FaVideo className="w-4 md:w-7  h-4 md:h-7" />
              </button>
              <button className="md:w-[80px]  bg-primaryDark items-center flex justify-center p-2 text-white rounded-xl">
                <IoIosMic className="w-4 md:w-7  h-4 md:h-7" />
              </button>
              <button
                onClick={EndCall}
                className="md:w-[80px]  bg-red-500 items-center flex justify-center p-2 text-white rounded-xl"
              >
                <MdCallEnd className="w-4 md:w-7  h-4 md:h-7" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CallContainer;
