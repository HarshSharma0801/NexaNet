"use client";
import { useGroupsContext } from "@/providers/group-provider";
import ConversationsItem from "./ConversationItem";
import { FunctionComponent } from "react";

interface ConversationProp {
  id: any;
  name: string;
  msg: string;
  timestamp: Date;
  isGroup: boolean;
}

const MobileConversations: FunctionComponent = () => {
  const { groups } = useGroupsContext();

  return (
    <div className="md:flex md:mr-0 mr-[6px] flex-col gap-1 bg-primaryDark rounded-2xl   p-1 mt-2 flex-1">
      {groups &&
        groups.length > 0 &&
        groups.map((item) => {
          return (
            <ConversationsItem
              isGroup={item.isGroup}
              id={item.id}
              key={item.id}
              name={item.name}
              msg={item.Message[0]?.content ?? ""}
              timestamp={item.Message[0]?.timestamp || new Date()}
            />
          );
        })}
    </div>
  );
};

export default MobileConversations;
