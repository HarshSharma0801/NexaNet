const YourMessage = () => {
  return (
    <div className="flex justify-end p-3 ">
      <div class="flex flex-col gap-1 p-2 md:py-3 md:px-4 max-w-screen md:max-w-[50%] bg-primarylighter rounded-bl-3xl rounded-tl-3xl rounded-br-xl text-white">
        <div className="text-sm  text-gray-300">You</div >
        <div className="text-lg">Welcome to group everyone !</div>
        <div className="flex justify-between px-1">
          <div></div>
          <div className="text-sm">12:00</div>
        </div>
      </div>
    </div>
  );
};

export default YourMessage;
