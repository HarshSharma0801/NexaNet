"use client";
import { useGroupsContext } from "@/providers/group-provider";
import {
  deleteUserGroupService,
  getUserGroupsByAdminService,
} from "@/services/user-group";
import { Group } from "@/types";
import { useRouter } from "next/navigation";
import { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";

const YourGroups: FunctionComponent = (): ReactElement => {
  const [groups, setGroups] = useState<Group[] | null>([]);
  const { getGroups } = useGroupsContext();
  const router = useRouter();
  const getAdminGroups = async () => {
    const Rawdata = localStorage.getItem("UserData");
    if (Rawdata) {
      const UserData = JSON.parse(Rawdata);
      const data = await getUserGroupsByAdminService(UserData.UserInfo.id);
      if (data.valid) {
        setGroups(data.groups);
      }
    }
  };

  useEffect(() => {
    getAdminGroups();
  }, []);

  const handledelete = async (id: string) => {
    const data = await deleteUserGroupService(id);
    if (data.valid) {
      getAdminGroups();
      getGroups();
    }
  };

  return (
    <div className="flex-[0.7] flex  p-4 pl-0 ">
      <div className="bg-primaryDark px-4 flex-1 gap-4 flex-col flex justify-center rounded-2xl text-center ">
        {groups &&
          groups.length > 0 &&
          groups.map((group) => {
            return (
              <div
                key={group.id}
                className="bg-primarylightDark rounded-xl p-2 py-3 flex justify-between cursor-pointer  border-b-2 transition duration-150 ease-in-out   active:shadow-lg "
              >
                <div className="flex gap-2 justify-between items-center w-full">
                  <div
                    onClick={() => {
                      router.push(`/home/Chat/${group.id}`);
                    }}
                    className="flex  items-center flex-1 gap-2"
                  >
                    <div className="w-10 h-10 bg-slate-400 rounded-full flex justify-center text-center text-xl">
                      {group.avatar ? (
                        <img
                          src={group.avatar}
                          className="object-cover w-full h-full rounded-full"
                        />
                      ) : (
                        <div className="m-auto">{group.name}</div>
                      )}
                    </div>
                    <div className="text-xl  text-center align-middle justify-center items-center flex font-semibold text-white">
                      {group.name}
                    </div>
                  </div>
                  <div className="flex z-10 flex-col gap-1 justify-center items-center">
                    <button
                      onClick={() => {
                        handledelete(group.id);
                      }}
                      className="p-1 rounded-full hover:bg-red-600"
                    >
                      <RxCross2 size={30} className="text-white" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default YourGroups;
