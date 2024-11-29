import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
const AuthenticateUser = () => {
  const [User, SetUser] = useState();
  const [isData , setisData] = useState(); 

  const nav = useNavigate()

  useEffect(() => {
    const getUser = () => {
      const data = JSON.parse(localStorage.getItem("UserData"));
      if(data){
        const token = data.access;
        const headers = {
            Authorization: `Bearer ${token}`,
          };
          const config = {
            headers: headers,
          };
    
          axios.get("/Token", config).then((res) => {
            if (res) {
                console.log(res.data);
                SetUser(res.data.Userdata);
                setisData(true)
            }
          });

      }
      else{
        setisData(false);
      }
  
    };

    getUser();
  }, []);

  return (
    <>
      <div className="min-h-screen flex  items-center justify-center bg-primaryDark">
        <div className="flex flex-col gap-[2rem] justify-center items-center text-center">

            {isData ?<><div>
            <h1 className="text-3xl text-white"> 🤗Bravo!! {User && User.name}</h1>

            </div>
            <div>
            <button onClick={()=>{nav('/home')}} className=" flex justify-center  py-3 px-4 transition duration-150 ease-in-out active:bg-primarylighter active:shadow-lg border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-primarylight hover:bg-primarylight focus:shadow-lg focus:outline-none focus:ring-offset-2 focus:ring-primarylighter">
           ZipZap Zooo!!
          </button>
            </div></>  : <><div>
            <h1 className="text-3xl text-white"> LOL!😁 you should login First </h1>

            </div>
            <div>
            <button onClick={()=>{nav('/login')}}  className=" flex justify-center  py-3 px-4 transition duration-150 ease-in-out active:bg-primarylighter active:shadow-lg border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-primarylight hover:bg-primarylight focus:shadow-lg focus:outline-none focus:ring-offset-2 focus:ring-primarylighter">
           Login
          </button>
            </div></> }
           

     
       
        </div>
      </div>
    </>
  );
};

export default AuthenticateUser;
