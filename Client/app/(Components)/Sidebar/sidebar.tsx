"use client";
import {
  FunctionComponent,
  ReactElement,
  ReactNode,
  useEffect,
  useState,
} from "react";
import ConversationsItem from "./ConversationItem";
import ConversationSearchItem from "./ConversationSearchItem";
import { useRouter } from "next/navigation";
import { useGroupsContext } from "@/providers/group-provider";
import { FaUser, FaUsers } from "react-icons/fa";
import { getUserByNameService } from "@/services/user";
import { getUserGroupByNameService } from "@/services/user-group";

interface ISearch {
  id: number;
  name: string;
  icon: ReactNode;
}

const Sidebar: FunctionComponent = (): ReactElement => {
  const router = useRouter();
  const DummyConversations = [
    {
      id: 1,
      name: "Manasvee",
      lastMessage: "Hello Harsh , I was",
      timestamp: "today",
    },
    {
      id: 2,
      name: "Raj",
      lastMessage: "Yo bro what u doing",
      timestamp: "today",
    },
    { id: 3, name: "Tina", lastMessage: "Lets play here ", timestamp: "today" },
  ];
  const icons = [
    {
      id: 1,
      name: "user",
      icon: <FaUser className="w-5 h-5 text-primarylighter cursor-pointer" />,
    },
    {
      id: 2,
      name: "group",
      icon: <FaUsers className="w-5 h-5 text-primarylighter cursor-pointer" />,
    },
  ];
  const { groups } = useGroupsContext();
  const [selectedSearchIcon, setSelectedSearchIcon] = useState<ISearch>(
    icons[0]
  );
  const [selectedSearch, setSelectedSearch] = useState<string>("");
  const [searchConversation, setSearchConversation] = useState<any>(null);

  const handleChange = (name: string) => {
    const search = icons.filter((item) => item.name !== name)[0];
    setSelectedSearchIcon(search);
  };

  const removeSearch = () => {
    setSelectedSearch("");
    setSearchConversation(null);
  };

  const handleSearch = async () => {
    try {
      if (selectedSearchIcon.name == "user") {
        const response = await getUserByNameService(selectedSearch);
        if (response.valid) {
          setSearchConversation(response.user);
        }
      } else {
        const response = await getUserGroupByNameService(selectedSearch);
        if (response.valid) {
          setSearchConversation(response.conversation);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex-[0.3] p-1 md:p-4 flex flex-col border-gray-400 ">
      <div className="rounded-2xl text-white p-3 justify-center text-center items-center flex-1 md:flex-[0.1] flex md:gap-4 gap-24 md:flex-row flex-col md:justify-between bg-primaryDark">
        <svg
          onClick={() => {
            router.push("/home/Conversations");
          }}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="rounded-full w-9 h-9 cursor-pointer md:hidden transition duration-150 ease-in-out hover:bg-primarylighter  focus:bg-primarylighter focus:shadow-lg focus:outline-none focus:ring-0 active:bg-neutral-400 active:shadow-lg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
          />
        </svg>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="rounded-full w-9 h-9 cursor-pointer  transition duration-150 ease-in-out hover:bg-primarylighter  focus:bg-primarylighter focus:shadow-lg focus:outline-none focus:ring-0 active:bg-neutral-400 active:shadow-lg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <div className="flex md:gap-4 gap-24  md:flex-row flex-col">
          <svg
            onClick={() => {
              router.push("/home/OnlineUsers");
            }}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="rounded-full w-9 h-9 cursor-pointer  transition duration-150 ease-in-out hover:bg-primarylighter  focus:bg-primarylighter focus:shadow-lg focus:outline-none focus:ring-0 active:bg-neutral-400 active:shadow-lg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
            />
          </svg>
          <svg
            onClick={() => {
              router.push("/home/YourGroups");
            }}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="rounded-full w-9 h-9 cursor-pointer  transition duration-150 ease-in-out hover:bg-primarylighter  focus:bg-primarylighter focus:shadow-lg focus:outline-none focus:ring-0 active:bg-neutral-400 active:shadow-lg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
            />
          </svg>
          <svg
            onClick={() => {
              router.push("/home/CreateGroup");
            }}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="rounded-full w-9 h-9 cursor-pointer  transition duration-150 ease-in-out hover:bg-primarylighter  focus:bg-primarylighter focus:shadow-lg focus:outline-none focus:ring-0 active:bg-neutral-400 active:shadow-lg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </div>
      </div>

      <div className="rounded-2xl w-full gap-1 justify-between bg-primaryDark text-white p-3 mt-2 hidden md:flex items-center ">
        <div
          className="cursor-pointer p-1 md:py-3"
          onClick={() => {
            handleChange(selectedSearchIcon.name);
          }}
        >
          {selectedSearchIcon.icon}
        </div>
        <input
          onChange={(e) => {
            setSelectedSearch(e.target.value);
          }}
          type="text"
          value={selectedSearch}
          placeholder="search"
          className="text-xl  outline-none bg-primaryDark"
        />
        <div
          className="hover:bg-primarylight rounded-full p-2 cursor-pointer"
          onClick={handleSearch}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8  "
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>{" "}
        </div>
      </div>

      {searchConversation && (
        <div className="pt-2">
          <ConversationSearchItem
            removeSearch={removeSearch}
            isGroup={searchConversation.isGroup}
            name={searchConversation.name}
            id={searchConversation.id}
          />
        </div>
      )}

      <div className="md:flex hidden flex-col gap-1 bg-primaryDark rounded-2xl   p-1 mt-2 flex-1">
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
                timestamp={item.Message[0]?.timestamp.toDateString() ?? ""}
              />
            );
          })}
      </div>
    </div>
  );
};

export default Sidebar;
