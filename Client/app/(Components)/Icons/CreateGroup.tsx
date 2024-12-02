"use client";
import { FunctionComponent, ReactElement, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { createUserGroupService } from "@/services/user-group";
import { useGroupsContext } from "@/providers/group-provider";
const CreateGroup: FunctionComponent = (): ReactElement => {
  const [groupName, setGroupName] = useState<string>("");
  const {getGroups} = useGroupsContext();
  const router = useRouter();
  const createGroup = useCallback(async () => {
    const Rawdata = localStorage.getItem("UserData");
    if (groupName !== "" && Rawdata) {
      const UserData = JSON.parse(Rawdata);
      const valid = await createUserGroupService({
        name: groupName,
        userId: UserData.UserInfo.id,
        username:UserData.UserInfo.username
      });
      if (valid) {
        getGroups()
        router.push("/home");
      }
    }
  }, [groupName]);

  return (
    <div className="flex-[0.7] flex p-1 md:p-4 pl-0 ">
      <div className="bg-primaryDark px-4 flex-1 gap-4  md:mr-0 mr-[12px] flex-col flex justify-center rounded-2xl text-center ">
        <div className="flex justify-start">
          <h1 className="md:text-2xl text-xl text-white">Enter Group's Name</h1>
        </div>
        <div className="flex-[0.1] rounded-2xl md:max-w-[100%] max-w-[90%] bg-primarylighter md:p-1 md:pr-5 justify-start md:justify-between flex items-center ">
          <input
            onChange={(e) => {
              console.log(e.target.value);
              setGroupName(e.target.value);
            }}
            type="text"
            placeholder="type something .."
            className="md:flex-1  md:text-2xl text-white p-[10px] md:max-w-[100%] max-w-[80%] text-[20px] md:text-[1.3rem] md:p-2 outline-none bg-primarylighter"
          />
          <svg
            onClick={createGroup}
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
    </div>
  );
};

export default CreateGroup;
