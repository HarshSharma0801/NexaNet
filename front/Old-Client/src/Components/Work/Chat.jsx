import YourMessage from "./Messages/YourMessage";
import OthersMessage from "./Messages/OthersMessage";
const Chat = () => {




  return (
    <>
      <div className="flex flex-[1] md:flex-[0.7] flex-col py-2 md:p-4 md:pl-0 gap-2 ">
        {/* //header */}
        <div className="flex flex-[0.1] gap-2 md:mr-0 mr-[6px]  bg-primaryDark rounded-2xl p-1 md:p-3 text-[13px] md:text-[1rem]">
          <div className="w-10 h-10 bg-slate-400 rounded-full flex justify-center text-center text-xl">
            <div className="m-auto">M</div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-xl font-semibold text-white">Name</div>
            <div className="text-gray-400">online</div>
          </div>
        </div>
        {/* chat */}
        <div className="flex-[0.8] text-[13px] md:text-[1rem] bg-primaryDark rounded-2xl md:mr-0 mr-[6px]  overflow-y-auto">
            
         <YourMessage/>
         <OthersMessage/>
         <YourMessage/>
         <OthersMessage/>


           

        </div>

        {/* input */}
        <div className="flex-[0.1] rounded-2xl md:max-w-[100%] max-w-[95%] bg-primaryDark md:p-1 md:pr-5 justify-start md:justify-between flex items-center ">
       
          <input
            type="text"
            placeholder="type something .."
            className="md:flex-1  md:text-2xl text-white p-[10px] md:max-w-[100%] max-w-[80%] text-[20px] md:text-[1.3rem] md:p-2 outline-none bg-primaryDark"
          />
            <svg
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
