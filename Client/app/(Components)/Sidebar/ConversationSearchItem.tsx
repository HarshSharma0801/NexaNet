"use client";
import { useGroupsContext } from "@/providers/group-provider";
import { FunctionComponent, ReactElement } from "react";
import { RxCross2 } from "react-icons/rx";

interface ConversationProp {
  id: string;
  name: string;
  avatar:string;
  isGroup: boolean;
  removeSearch: () => void;
}

const ConversationSearchItem: FunctionComponent<ConversationProp> = (
  props: ConversationProp
): ReactElement => {
  const { getConversation } = useGroupsContext();
  return (
    <div className="bg-primaryDark rounded-xl  flex justify-between cursor-pointer  border-b-2 transition duration-150 ease-in-out   focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg ">
      <div
        onClick={() => {
          getConversation(props.id, props.isGroup, props.name);
        }}
        className="flex hover:bg-primarylighter rounded-xl  px-3 py-3 focus:bg-primarylighter space-between  w-full"
      >
        <div className="flex gap-4 items-center w-full">
          <div className="w-10 h-10 bg-slate-400 rounded-full flex justify-center text-center text-xl">
           {props.avatar ? <img src={props.avatar} className="object-cover w-full h-full rounded-full"/> :  <div className="m-auto">{props.name[0]}</div>}
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-xl font-semibold text-white">{props.name}</div>
          </div>
        </div>
      </div>
      <div className="p-3">
        <button
          onClick={() => {
            props.removeSearch();
          }}
          className="p-1 rounded-full hover:bg-red-600"
        >
          <RxCross2 size={30} className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default ConversationSearchItem;
