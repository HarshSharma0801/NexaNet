"use client";
import axios from "axios";
import { useState, useEffect, FunctionComponent, ReactElement } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/providers/auth-provider";

const AuthenticateUser: FunctionComponent = (): ReactElement => {
  const [User, SetUser] = useState<any>(null);
  const [isData, setisData] = useState<boolean>(false);

  const router = useRouter();
  const { setUser } = useAuthContext();

  useEffect(() => {
    const getUser = async () => {
      const Rawdata = localStorage.getItem("UserData");
      if (Rawdata) {
        const data = JSON.parse(Rawdata);
        const token = data.access;
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        try {
          const res = await axios.get("http://localhost:7070/token", { headers });
          if (res.status === 200) {
            SetUser(res.data.UserInfo.Userdata);
            setUser(res.data.UserInfo.Userdata);
            setisData(true);
          }
        } catch (error: any) {
          if (error.response?.status === 403) {
            console.warn("Access forbidden. Redirecting to login.");
            setisData(false);
          } else {
            console.error("An unexpected error occurred:", error.message);
            setisData(false);
          }
        }
      } else {
        setisData(false);
      }
    };

    getUser();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-primaryDark">
      <div className="flex flex-col gap-8 justify-center items-center text-center">
        {isData ? (
          <>
            <div>
              <h1 className="text-3xl text-white">🤗 Bravo!! {User?.username}</h1>
            </div>
            <div>
              <button
                onClick={() => router.push("/home")}
                className="flex justify-center py-3 px-4 transition duration-150 ease-in-out active:bg-primarylighter active:shadow-lg border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-primarylight hover:bg-primarylight focus:shadow-lg focus:outline-none focus:ring-offset-2 focus:ring-primarylighter"
              >
                ZipZap Zooo!!
              </button>
            </div>
          </>
        ) : (
          <>
            <div>
              <h1 className="text-3xl text-white">LOL!😁 You should login first</h1>
            </div>
            <div>
              <button
                onClick={() => router.push("/login")}
                className="flex justify-center py-3 px-4 transition duration-150 ease-in-out active:bg-primarylighter active:shadow-lg border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-primarylight hover:bg-primarylight focus:shadow-lg focus:outline-none focus:ring-offset-2 focus:ring-primarylighter"
              >
                Login
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthenticateUser;
