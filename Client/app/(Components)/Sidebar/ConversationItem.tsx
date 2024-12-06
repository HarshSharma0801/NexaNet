"use client";
import { useGroupsContext } from "@/providers/group-provider";
import { FunctionComponent, ReactElement } from "react";
import { timeConvert } from "@/util";
interface ConversationProp {
  id: any;
  name: string;
  msg: string;
  timestamp: Date;
  isGroup: boolean;
  avatar: string;
}

const ConversationsItem: FunctionComponent<ConversationProp> = (
  props: ConversationProp
): ReactElement => {
  const { getConversation } = useGroupsContext();

  return (
    <div
      onClick={() => {
        getConversation(props.id, props.isGroup, props.name);
      }}
      className="bg-primaryDark rounded-xl p-2 py-3 flex justify-between cursor-pointer  border-b-2 transition duration-150 ease-in-out  hover:bg-primarylighter  focus:bg-primarylighter focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primarylighter active:shadow-lg "
    >
      <div className="flex gap-2 justify-center">
        <div className="flex justify-center items-center">
          <div className="w-10 h-10 bg-slate-400 rounded-full flex justify-center text-center text-xl">
            {props.avatar ? (
              <img src={props.avatar} className="object-cover w-full h-full rounded-full" />
            ) : (
              <div className="m-auto">{props.name[0]}</div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-xl font-semibold text-white">{props.name}</div>
          <div className="text-gray-300 hidden md:block">
            {" "}
            {`${props.msg.substring(0, 10)}..`}
          </div>
          <div className="text-gray-300  md:hidden">
            {`${props.msg.substring(0, 10)}..`}
          </div>
        </div>
      </div>

      <div className="flex justify-end text-white">
        <div>{timeConvert(props.timestamp)}</div>
      </div>
    </div>
  );
};

export default ConversationsItem;
