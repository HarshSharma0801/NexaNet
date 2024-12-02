"use client";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "../(Components)/Loader";
import { LoginService } from "@/services/auth";

const Login: FunctionComponent = (): ReactElement => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isloading, Setisloading] = useState(false);
  const [err, seterr] = useState(false);

  const router = useRouter();

  const load = () => {
    Setisloading((prev) => {
      return !prev;
    });
  };

  const formdata = { password: password, username: username };

  const handleLogin = async () => {
    const isValid = await LoginService({ data: formdata, load: load });
    if (!isValid) {
      seterr(true);
      Setisloading(false);
    } else {
      router.push("/");
    }
  };

  return (
    <>
      {isloading && <Loader />}
      <div className="min-h-screen flex items-center justify-center bg-primaryDark">
        <div className="max-w-md w-full p-6 space-y-8 bg-primaryDark  rounded-md">
          <div>
            <h2 className="text-3xl font-extrabold text-center text-white">
              Log in to your account
            </h2>
            {err && (
              <h1 className="text-[16px] pt-3 font-extrabold text-center text-primarylight">
                Enter Correct Credentials !!
              </h1>
            )}
          </div>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-300"
              >
                Username
              </label>
              <input
                id="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 p-2 w-full border rounded-md outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 p-2 w-full border rounded-md outline-none"
              />
            </div>
            <div>
              <button
                type="submit"
                onClick={handleLogin}
                className="w-full flex justify-center  py-3 px-4 transition duration-150 ease-in-out active:bg-primarylighter active:shadow-lg border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-primarylight hover:bg-primarylight focus:shadow-lg focus:outline-none focus:ring-offset-2 focus:ring-primarylighter"
              >
                let's go !
              </button>
            </div>
          </form>
          <button
            onClick={() => {
              router.push("/signup");
            }}
            className="w-full flex justify-center  py-3 px-4 transition duration-150 ease-in-out active:bg-primarylighter active:shadow-lg   rounded-md shadow-sm text-lg font-medium text-primarylight hover:text-white bg-white border-[3px] border-primarylight hover:bg-primarylight focus:shadow-lg focus:outline-none focus:ring-offset-2 focus:ring-primarylighter"
          >
            Sign Up
          </button>
        </div>
      </div>
    </>
  );
};

export default Login;
