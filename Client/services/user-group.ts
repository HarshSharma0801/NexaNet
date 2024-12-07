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
  groupId: string,
  isGroup: boolean
): Promise<{ conversation: Group | null; valid: boolean }> => {
  try {
    const { data } = await axios.post("/checkUserGroup", {
      userId: userId,
      groupId: groupId,
      isGroup: isGroup,
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
  groupId: string | string[],
  userId: number
): Promise<{ conversation: Group | null; valid: boolean }> => {
  try {
    const { data } = await axios.get(`/userGroup/${groupId}`, {
      params: {
        userId: userId,
      },
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

export const getUserGroupByNameService = async (
  name: string | string[]
): Promise<{ conversation: Group | null; valid: boolean }> => {
  try {
    const { data } = await axios.get(`/userGroup`, {
      params: {
        name: name,
      },
    });
    if (data.valid) {
      return { valid: true, conversation: data.group[0] };
    }
    return { valid: false, conversation: null };
  } catch (error) {
    console.error("Error fetching user group:", error);
    return { valid: false, conversation: null };
  }
};



export const getUserGroupsByAdminService = async (
  userId: string | string[]
): Promise<{ groups: Group[] | null; valid: boolean }> => {
  try {
    const { data } = await axios.get(`/userGroupAdmin`, {
      params: {
        userId: userId,
      },
    });

    if (data.valid) {
      return { valid: true, groups: data.groups };
    }
    return { valid: false, groups: null };
  } catch (error) {
    console.error("Error fetching user groups:", error);
    return { valid: false, groups: null };
  }
};


export const deleteUserGroupService = async (
  groupId: string
): Promise<{ valid: boolean; message: string }> => {
  try {
    const { data } = await axios.delete(`/userGroup`, {
      data: {
        groupId: groupId,
      },
    });

    if (data.valid) {
      return { valid: true, message: "Group deleted successfully" };
    }
    return { valid: false, message: "Failed to delete group" };
  } catch (error) {
    console.error("Error deleting user group:", error);
    return { valid: false, message: "Internal Server Error" };
  }
};
