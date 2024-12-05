import { Member } from "@/types";
import axios from "axios";

interface ICreateMember {
  userId: string;
  groupId: string;
  code: string;
}

export const createMemberService = async (
  values: ICreateMember
): Promise<{ newMember: Member | null; valid: boolean; message: string }> => {
  try {
    const { data } = await axios.post(`/createMember`, {
      userId: values.userId,
      groupId: values.groupId,
      code: values.code,
    });
    if (data.valid) {
      return { valid: true, newMember: data.user, message: data.message };
    }
    return { valid: false, newMember: null, message: "code invalid" };
  } catch (error) {
    console.error("Error fetching user group:", error);
    return { valid: false, newMember: null, message: "code invalid" };
  }
};
