"use client";
import {
  FunctionComponent,
  ReactElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import YourMessage from "./YourMessage";
import OthersMessage from "./OthersMessage";
import { useParams } from "next/navigation";
import { getSocket } from "@/providers/socket";
import { getUserGroupByIdService } from "@/services/user-group";
import { Group, Message } from "@/types";
import { useAuthContext } from "@/providers/auth-provider";

interface ReceivedMessage {
  valid: boolean;
  message: Message;
}

const Chat: FunctionComponent = (): ReactElement => {
  const { id } = useParams();

  const [conversation, setConversation] = useState<Group | null>(null);
  const [message, setMessage] = useState<string>("");
  const [AllMessages, setAllMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthContext();

  const getConversation = async () => {
    const Rawdata = localStorage.getItem("UserData");
    if (id && Rawdata) {
      const UserData = JSON.parse(Rawdata);
      const { conversation } = await getUserGroupByIdService(
        id,
        UserData.UserInfo.id
      );
      if (conversation) {
        setConversation(conversation);
        setAllMessages(conversation.Message);
      }
    }
  };

  useEffect(() => {
    getConversation();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [AllMessages]);

  const socket = useMemo(() => {
    const socketIO = getSocket();
    socketIO.auth = {
      conversation: id,
    };
    return socketIO.connect();
  }, [id]);

  useEffect(() => {
    socket.on("message", (data: ReceivedMessage) => {
      console.log(data.message);
      setAllMessages((prev) => {
        return [...prev, data.message];
      });
    });
    return () => {
      socket.close();
    };
  }, [socket]);

  const sendMessage = () => {
    const Rawdata = localStorage.getItem("UserData");
    if (Rawdata && id && message !== "") {
      const user = JSON.parse(Rawdata);
      const data = {
        userId: user.UserInfo.id,
        content: message,
        name: user.UserInfo.username,
        groupId: id,
      };
      socket.emit("message", data);
    }
    setMessage("");
  };

  return (
    <>
      <div className="flex flex-[1] md:flex-[0.7] flex-col py-2 md:p-4 md:pl-0 gap-2 ">
        <div className="flex flex-[0.05] gap-2 md:mr-0 mr-[6px]  bg-primaryDark rounded-2xl p-3 md:p-3 text-[13px] md:text-[1rem]">
          <div className="w-10 h-10 bg-slate-400 rounded-full flex justify-center text-center text-xl">
            <div className="m-auto">M</div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-xl font-semibold text-white">
              {conversation && conversation?.name}
            </div>
            <div className="text-gray-400">online</div>
          </div>
        </div>
        <div
          ref={scrollRef}
          className="flex-[0.9] text-[13px] md:text-[1rem] bg-primaryDark rounded-2xl md:mr-0 mr-[6px]  overflow-y-auto"
        >
          {conversation &&
            AllMessages?.length > 0 &&
            AllMessages?.map((message) => {
              if (user?.id === message.userId) {
                return (
                  <YourMessage
                    content={message.content}
                    key={message.id}
                    timestamp={message.timestamp}
                  />
                );
              } else {
                return (
                  <OthersMessage
                    content={message.content}
                    key={message.id}
                    timestamp={message.timestamp}
                    name={message.name}
                  />
                );
              }
            })}
        </div>

        <div className="flex-[0.1] rounded-2xl md:max-w-[100%] max-w-[98%] bg-primaryDark md:p-1 md:pr-5 justify-start md:justify-between flex items-center ">
          <input
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            value={message}
            type="text"
            placeholder="type something .."
            className="md:flex-1  md:text-2xl text-white p-[10px] md:max-w-[100%] max-w-[80%] text-[20px] md:text-[1.3rem] md:p-2 outline-none bg-primaryDark"
          />
          <svg
            onClick={() => {
              sendMessage();
            }}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8 text-white cursor-pointer"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"
            />
          </svg>
        </div>
      </div>
    </>
  );
};

export default Chat;
