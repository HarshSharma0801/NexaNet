"use client";
import {
  FunctionComponent,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from "react";
import YourMessage from "./YourMessage";
import OthersMessage from "./OthersMessage";
import { getUserGroupByIdService } from "@/services/user-group";
import { Group, Message, OngoingCall } from "@/types";
import MemberItem from "./MemberItem";
import { useSocketContext } from "@/providers/socket-provider";
import { FaVideo } from "react-icons/fa";
import { IoCallSharp } from "react-icons/io5";
import { MdCallEnd } from "react-icons/md";
import DotsAnimation from "../Dots";
import { useCallContext } from "@/providers/call-provider";

interface ReceivedMessage {
  valid: boolean;
  message: Message;
}

const Chat: FunctionComponent<{ id: string; callData: OngoingCall | null }> = ({
  id,
  callData,
}): ReactElement => {
  const { socketJoin, socket } = useSocketContext();
  const { DialCall, JoinCall } = useCallContext();
  const [conversation, setConversation] = useState<Group | null>(null);
  const [message, setMessage] = useState<string>("");
  const [AllMessages, setAllMessages] = useState<Message[]>([]);
  const [DetailOpen, setDetailOpen] = useState<boolean>(false);
  const [mainUserId, setMainUserId] = useState<number | null>(null);
  const [mainUser, setMainUser] = useState<any>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  const getConversation = async () => {
    const Rawdata = localStorage.getItem("UserData");
    if (id && Rawdata) {
      const UserData = JSON.parse(Rawdata);
      setMainUser(UserData.UserInfo);
      const { conversation } = await getUserGroupByIdService(
        id,
        UserData.UserInfo.id
      );
      if (conversation) {
        setConversation(conversation);
        socketJoin(conversation.id);
        setAllMessages(conversation.Message);
        setMainUserId(UserData.UserInfo.id);
        setDetailOpen(false);
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

  // useEffect(() => {
  //   socket?.on("message", (data: ReceivedMessage) => {
  //     setAllMessages((prev) => {
  //       return [...prev, data.message];
  //     });
  //   });
  //   return () => {
  //     socket?.close();
  //   };
  // }, [socket]);

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
      socket?.emit("send-message", data, id);
    }
    setMessage("");
  };

  const MakeCall = () => {
    const callData: OngoingCall = {
      conversatiionId: id,
      status: 1,
      caller: mainUser,
    };

    DialCall(callData);
  };

  const JoinVCall = () => {
    const callData: OngoingCall = {
      conversatiionId: id,
      status: 1,
      caller: mainUser,
    };

    JoinCall(callData);
  };

  return (
    <>
      <div className="flex flex-[1] md:flex-[0.7] flex-col py-2 md:p-4 md:pl-0 gap-2 relative">
        {callData && (
          <div className=" bg-light w-[200px]  top-24 right-6 md:w-[400px] md:h-[200px] rounded-xl absolute md:top-40 md:right-16 cursor-pointer">
            <div className="p-2 md:p-6 flex justify-center flex-col gap-3 md:gap-6 items-center w-full">
              <div className="flex justify-start gap-3 items-center">
                <div className="md:w-16 w-8 md:h-16 h-8 bg-slate-400 rounded-full flex justify-start text-center text-xl">
                  {conversation?.avatar ? (
                    <img
                      src={conversation.avatar}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="m-auto">{conversation?.name[0]}</div>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-[8px] md:text-[16px]">Incoming Call</div>
                  <div className="text-[12px] md:text-[20px]">
                    {callData.caller.username}
                  </div>
                </div>
              </div>

              <div>
                <DotsAnimation />
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={JoinVCall}
                  className="md:w-[80px]  bg-green-500 items-center flex justify-center p-2 text-white rounded-xl"
                >
                  <IoCallSharp className="w-4 md:w-7  h-4 md:h-7" />
                </button>
                <button className="md:w-[80px]  bg-red-500 items-center flex justify-center p-2 text-white rounded-xl">
                  <MdCallEnd className="w-4 md:w-7  h-4 md:h-7" />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex  flex-[0.05] gap-2 md:mr-0 mr-[6px]   bg-primaryDark rounded-2xl p-3 md:p-3 text-[13px] md:text-[1rem]">
          <div className="flex gap-2 justify-between w-full">
            <div
              onClick={() => {
                if (conversation?.isGroup) {
                  setDetailOpen(true);
                }
              }}
              className="flex cursor-pointer flex-1 gap-2 justify-start items-center"
            >
              <div className="w-10 h-10 bg-slate-400 rounded-full flex justify-start text-center text-xl">
                {conversation?.avatar ? (
                  <img
                    src={conversation.avatar}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="m-auto">{conversation?.name[0]}</div>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-xl font-semibold text-white">
                  {conversation && conversation?.name}
                </div>
                <div className="text-gray-400">online</div>
              </div>
            </div>

            <div className="text-white flex justify-center items-center ">
              <button
                onClick={MakeCall}
                className="flex justify-center items-center p-3 rounded-[50%]"
              >
                <FaVideo className="w-8 h-6" />
              </button>
            </div>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex-[0.9] text-[13px] md:text-[1rem] bg-primaryDark rounded-2xl md:mr-0 mr-[6px]  overflow-y-auto"
        >
          {conversation &&
            AllMessages?.length > 0 &&
            AllMessages?.map((message) => {
              if (mainUser?.id === message.userId) {
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
                    avatar={message.avatar}
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
            className="md:flex-1  md:text-2xl text-white p-[10px] rounded-xl md:max-w-[100%] max-w-[80%] text-[20px] md:text-[1.3rem] md:p-2 outline-none bg-primaryDark"
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

      <div className={`fixed z-50	 inset-0 ${DetailOpen ? "block" : "hidden"}`}>
        <div className="fixed inset-0 bg-primaryDark opacity-50"></div>
        <div className="fixed inset-0 flex items-center justify-center overflow-auto">
          <div className="bg-secondary p-3 w-[90%] md:p-6 bg-light md:w-[50%] flex flex-col md:gap-4 gap-2 rounded-2xl">
            <div
              className="flex justify-end cursor-pointer"
              onClick={() => {
                setDetailOpen(false);
              }}
            >
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-[#5D6D7E]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl  font-bold text-[#5D6D7E] text-center mb-1 ">
              Members
            </h2>

            <div className="md:py-4 py-2 flex flex-col justify-center overflow-y-auto">
              {conversation &&
                conversation.Member.map((member) => {
                  return (
                    <MemberItem
                      key={member.id}
                      name={member.name}
                      avatar={member.avatar}
                      id={member.id}
                      memberUserId={member.userId}
                      adminId={conversation.adminId}
                      getConversation={getConversation}
                      setDetailOpen={setDetailOpen}
                      userId={mainUserId ?? 0}
                    />
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
