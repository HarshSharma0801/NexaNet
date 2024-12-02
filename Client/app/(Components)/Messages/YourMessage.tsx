'use client'

import { timeConvert } from "@/util";
import { FunctionComponent, ReactElement } from "react";

interface IYourMessage {
 content:string;
 timestamp:Date
}

const YourMessage:FunctionComponent<IYourMessage> = ({content , timestamp}):ReactElement => {
  return (
    <div className="flex justify-end p-3 ">
      <div className="flex flex-col gap-1 p-2 md:py-3 md:px-4 max-w-screen md:max-w-[50%] bg-primarylighter rounded-bl-3xl rounded-tl-3xl rounded-br-xl text-white">
        <div className="text-sm  text-gray-300">You</div >
        <div className="text-lg">{content}</div>
        <div className="flex justify-between px-1">
          <div></div>
          <div className="text-sm">{timeConvert(timestamp.toDateString())}</div>
        </div>
      </div>
    </div>
  );
};

export default YourMessage;
