"use client";

import { useJoinModal } from "@/providers/modal-provider";
import { createMemberService } from "@/services/member";
import { useRouter } from "next/navigation";
import { FunctionComponent, ReactElement, useState } from "react";

export const JoinGroup: FunctionComponent = (): ReactElement => {
  const { open, setOpen, name, id, userId } = useJoinModal();
  const [groupCode, setGroupCode] = useState<string>("");
  const router = useRouter();

  const handleJoin = async () => {
    if (groupCode && id && userId) {
      const data = await createMemberService({
        userId,
        groupId: id,
        code: groupCode,
      });
      if (data.valid) {
        setOpen(false);
        router.push(`/home/Chat/${id}`);
      }
    }
  };

  return (
    <>
      <div className={`fixed z-50	 inset-0 ${open ? "block" : "hidden"}`}>
        <div className="fixed inset-0 bg-primaryDark opacity-50"></div>
        <div className="fixed inset-0 flex items-center justify-center overflow-auto">
          <div className="bg-secondary p-3 w-[90%] md:p-6 bg-[#4C0033] md:w-[50%] flex flex-col md:gap-4 gap-2 rounded-2xl">
            <div
              className="flex justify-end cursor-pointer"
              onClick={() => {
                setOpen(false);
              }}
            >
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl  font-bold text-white text-center mb-1 ">
              {name}
            </h2>
            <div className="">
              <input
                onChange={(e) => {
                  setGroupCode(e.target.value);
                }}
                type="text"
                placeholder="enter group code"
                className="text-xl w-full  outline-none bg-transparent text-white font-bold "
              />
            </div>

            <div className="md:py-4 py-2 flex justify-center">
              <button
                onClick={handleJoin}
                className="bg-primarylight p-5 px-8 text-white font-bold rounded-xl"
              >
                Join
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
