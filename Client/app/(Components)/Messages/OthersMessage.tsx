"use client";
import { timeConvert } from "@/util";
import { FunctionComponent, ReactElement } from "react";

interface IOtherMessage {
  content: string;
  timestamp: Date;
  name: string;
  avatar?: string;
}

const OthersMessage: FunctionComponent<IOtherMessage> = ({
  content,
  timestamp,
  name,
  avatar,
}): ReactElement => {
  return (
    <>
      <div className="flex md:w-[50%] p-1 md:p-2">
        <div className=" flex gap-[0.3rem]">
          <div className="flex-none flex flex-col justify-start ">
            <div className="rounded-full w-10 h-10  bg-slate-400 flex justify-center items-center text-center ">
              {avatar ? (
                <img src={avatar} className="w-full h-full object-cover rounded-full" />
              ) : (
                name[0]
              )}
            </div>
          </div>
          <div className="py-1">
            <div className=" flex flex-col min-w-[100px] gap-1 py-2 px-2  bg-primarylight rounded-bl-3xl rounded-tr-3xl rounded-br-xl text-white">
              <div className="text-sm text-gray-300">{name}</div>
              <div className="text-lg">{content}</div>
              <div className="flex justify-between px-1">
                <div></div>
                <div className="text-sm">{timeConvert(timestamp)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OthersMessage;
