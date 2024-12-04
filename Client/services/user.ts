import { User } from "@/types";
import axios from "axios";

export const getUserByNameService = async (
  name: string | string[]
): Promise<{ user: User | null; valid: boolean }> => {
  try {
    const { data } = await axios.get(`/user`, {
      params: {
        name: name,
      },
    });
    if (data.valid) {
      return { valid: true, user: data.user };
    }
    return { valid: false, user: null };
  } catch (error) {
    console.error("Error fetching user group:", error);
    return { valid: false, user: null };
  }
};
