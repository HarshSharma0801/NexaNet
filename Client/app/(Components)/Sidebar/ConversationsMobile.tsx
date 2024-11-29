'use client'
import ConversationsItem from "./ConversationItem";

const MobileConversations = () => {
  const DummyChat = [
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

  return (
    <div className="md:flex md:mr-0 mr-[6px] flex-col gap-1 bg-primaryDark rounded-2xl   p-1 mt-2 flex-1">
      {DummyChat.map((item) => {
        return (
          <ConversationsItem
            key={item.id}
            name={item.name}
            msg={item.lastMessage}
            timestamp={item.timestamp}
          />
        );
      })}
    </div>
  );
};

export default MobileConversations;
