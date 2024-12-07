"use client";
import { deleteMemberService } from "@/services/member";
import {
  FunctionComponent,
  ReactElement,
  Dispatch,
  SetStateAction,
} from "react";
import { RxCross2 } from "react-icons/rx";
interface MemberProp {
  id: any;
  name: string;
  avatar: string;
  adminId: number;
  memberUserId: number;
  getConversation: () => void;
  setDetailOpen: Dispatch<SetStateAction<boolean>>;
  userId: number;
}

const MemberItem: FunctionComponent<MemberProp> = (
  props: MemberProp
): ReactElement => {
  const handleDelete = async () => {
    const data = await deleteMemberService(props.id);
    console.log(data)
    if (data.valid) {
        console.log("jkj")
      props.getConversation();
    }
  };

  return (
    <div className="bg-primaryDark rounded-xl p-2 py-3 flex justify-between cursor-pointer  border-b-2 transition duration-150 ease-in-out   active:shadow-lg ">
      <div className="flex gap-2 justify-between items-center w-full">
        <div className="flex justify-center items-center gap-2">
          <div className="w-10 h-10 bg-slate-400 rounded-full flex justify-center text-center text-xl">
            {props.avatar ? (
              <img
                src={props.avatar}
                className="object-cover w-full h-full rounded-full"
              />
            ) : (
              <div className="m-auto">{props.name[0]}</div>
            )}
          </div>
          <div className="text-xl  text-center align-middle justify-center items-center flex font-semibold text-white">
            {props.name}
          </div>
        </div>
        <div className="flex flex-col gap-1 justify-center items-center">
          {props.adminId !== props.memberUserId &&
            props.adminId == props.userId && (
              <button
                onClick={handleDelete}
                className="p-1 rounded-full hover:bg-red-600"
              >
                <RxCross2 size={30} className="text-white" />
              </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default MemberItem;
