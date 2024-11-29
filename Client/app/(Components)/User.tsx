"use client";
import axios from "axios";
import { useState, useEffect, FunctionComponent, ReactElement } from "react";
import { useRouter } from "next/navigation";
const AuthenticateUser: FunctionComponent = (): ReactElement => {
  const [User, SetUser] = useState<any>();
  const [isData, setisData] = useState<boolean>();

  const router = useRouter();

  useEffect(() => {
    const getUser = () => {
      const Rawdata = localStorage.getItem("UserData");
      if (Rawdata) {
        const data = JSON.parse(Rawdata);
        const token = data.access;
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const config = {
          headers: headers,
        };

        axios.get("/Token", config).then((res) => {
          if (res) {
            SetUser(res.data.Userdata);
            setisData(true);
          }
        });
      } else {
        setisData(false);
      }
    };

    getUser();
  }, []);

  return (
    <>
      <div className="min-h-screen flex  items-center justify-center bg-primaryDark">
        <div className="flex flex-col gap-[2rem] justify-center items-center text-center">
          {isData ? (
            <>
              <div>
                <h1 className="text-3xl text-white"> 🤗Bravo!! {User.name}</h1>
              </div>
              <div>
                <button
                  onClick={() => {
                    router.push("/home");
                  }}
                  className=" flex justify-center  py-3 px-4 transition duration-150 ease-in-out active:bg-primarylighter active:shadow-lg border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-primarylight hover:bg-primarylight focus:shadow-lg focus:outline-none focus:ring-offset-2 focus:ring-primarylighter"
                >
                  ZipZap Zooo!!
                </button>
              </div>
            </>
          ) : (
            <>
              <div>
                <h1 className="text-3xl text-white">
                  {" "}
                  LOL!😁 you should login First{" "}
                </h1>
              </div>
              <div>
                <button
                  onClick={() => {
                    router.push("/login");
                  }}
                  className=" flex justify-center  py-3 px-4 transition duration-150 ease-in-out active:bg-primarylighter active:shadow-lg border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-primarylight hover:bg-primarylight focus:shadow-lg focus:outline-none focus:ring-offset-2 focus:ring-primarylighter"
                >
                  Login
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AuthenticateUser;
