import Main from "./main";

const Welcome = () => {

  const UserData = JSON.parse(localStorage.getItem("UserData"));

 
  return (
    <div className="flex-[0.7] flex p-4 pl-0 ">
      <div className="bg-primaryDark flex-1 flex justify-center text-center text-xl md:text-2xl text-white rounded-2xl">
        <div className="flex items-center justify-center">
          <div>
         Yo👏 <span className="text-primarylight">{UserData.UserInfo.name}</span>  Get Started !!

          </div>
          </div>
      </div>
    </div>
  );
};

export default Welcome;
