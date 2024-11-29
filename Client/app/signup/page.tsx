'use client'
import React, { ChangeEvent, FormEvent, FunctionComponent, ReactElement, useState } from "react";
import { SignUpService } from "@/services/auth";
import { useRouter } from "next/navigation";
const SignUp:FunctionComponent = ():ReactElement => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    UniqueUsername: "",
  });
  const [err, seterr] = useState(false);
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const Valid = await SignUpService(formData);
    if (!Valid) {
      seterr(true);
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primaryDark">
      <div className="max-w-md w-full p-6 space-y-8 bg-primaryDark  rounded-md">
        <div>
          <h2 className="text-3xl font-extrabold text-center text-white">
            Create your account
          </h2>
          {err && (
            <h1 className="text-[16px] pt-3 font-extrabold text-center text-primarylight">
              Try Different Email or Username !!
            </h1>
          )}
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
              Name
            </label>
            <input
              id="name"
              type="name"
              autoComplete="name"
              required
              name="name"
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
              Username
            </label>
            <input
              id="username"
              type="username"
              autoComplete="name"
              required
              name="UniqueUsername"
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              name="email"
              onChange={handleChange}
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
              onChange={handleChange}
              name="password"
              className="mt-1 p-2 w-full border rounded-md outline-none"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center  py-3 px-4 transition duration-150 ease-in-out active:bg-primarylighter active:shadow-lg border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-primarylight hover:bg-primarylight focus:shadow-lg focus:outline-none focus:ring-offset-2 focus:ring-primarylighter"
            >
              All set
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
