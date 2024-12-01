import { Group } from "@/types";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:7070";

interface UserGroupData {
  name: string;
  userId: number;
  username: string;
}

export const createUserGroupService = async (
  userGroupData: UserGroupData
): Promise<boolean> => {
  try {
    const { data } = await axios.post("/createUserGroup", userGroupData);

    if (data.valid) {
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error creating user group:", error);
    return false;
  }
};

export const fetchUserGroupsService = async (userId: string): Promise<any> => {
  try {
    const { data } = await axios.get("/fetchUserGroups", {
      params: {
        userId: userId,
      },
    });

    if (data.valid) {
      return data.groups;
    }

    return false;
  } catch (error) {
    console.error("Error fetching user group:", error);
    return false;
  }
};

export const checkUserGroupsService = async (
  userId: string,
  groupId: string
): Promise<{ conversation: Group | null; valid: boolean }> => {
  try {
    const { data } = await axios.post("/checkUserGroup", {
      userId: userId,
      groupId: groupId,
    });

    if (data.valid) {
      return { valid: true, conversation: data.group };
    }

    return { valid: false, conversation: null };
  } catch (error) {
    console.error("Error fetching user group:", error);
    return { valid: false, conversation: null };
  }
};

export const getUserGroupByIdService = async (
  groupId: string | string[]
): Promise<{ conversation: Group | null; valid: boolean }> => {
  try {
    const { data } = await axios.get(`/userGroup/${groupId}`);
    if (data.valid) {
      return { valid: true, conversation: data.group };
    }
    return { valid: false, conversation: null };
  } catch (error) {
    console.error("Error fetching user group:", error);
    return { valid: false, conversation: null };
  }
};
