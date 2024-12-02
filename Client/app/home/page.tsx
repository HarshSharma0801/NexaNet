"use client";
import { useAuthContext } from "@/providers/auth-provider";
import { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
const Welcome: FunctionComponent = (): ReactElement => {
  const router = useRouter();
  const [useer, setUser] = useState(null);
  const { user } = useAuthContext();
  useEffect(() => {
    const Rawdata = localStorage.getItem("UserData");

    if (!Rawdata) {
      router.push("/");
    } else {
      const UserData = JSON.parse(Rawdata);
      setUser(UserData.UserInfo);
    }
  }, []);

  return (
    <div className="flex-[0.7] flex p-4 pl-0 ">
      <div className="bg-primaryDark flex-1 flex justify-center text-center text-xl md:text-2xl text-white rounded-2xl">
        <div className="flex items-center justify-center">
          <div>
            Yo👏{" "}
            <span className="text-primarylight">{user && user.username}</span>{" "}
            Get Started !!
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
