"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { Group } from "@/types";
import {
  checkUserGroupsService,
  fetchUserGroupsService,
} from "@/services/user-group";
import { useRouter } from "next/navigation";

interface GroupsContextType {
  groups: Group[] | null;
  setGroups: React.Dispatch<React.SetStateAction<Group[] | null>>;
  getGroups: () => Promise<void>;
  conversation: Group | null;
  getConversation: (id: string) => Promise<void>;
}

const GroupsContext = createContext<GroupsContextType | undefined>(undefined);

export const useGroupsContext = (): GroupsContextType => {
  const context = useContext(GroupsContext);
  if (!context) {
    throw new Error("useGroupsContext must be used within a GroupsProvider");
  }
  return context;
};

export const GroupsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [groups, setGroups] = useState<Group[] | null>(null);
  const [conversation, setConversation] = useState<Group | null>(null);

  const getGroups = async () => {
    const Rawdata = localStorage.getItem("UserData");
    if (Rawdata) {
      const UserData = JSON.parse(Rawdata);
      const groups = await fetchUserGroupsService(UserData.UserInfo.id);
      if (groups.length > 0) {
        setGroups(groups);
      }
    }
  };
  const router = useRouter();
  const getConversation = async (id: string) => {
    const Rawdata = localStorage.getItem("UserData");
    if (Rawdata) {
      const UserData = JSON.parse(Rawdata);
      const { valid, conversation } = await checkUserGroupsService(
        UserData.UserInfo.id,
        id
      );
      if (valid) {
        setConversation(conversation);
        router.push(`/home/Chat/${conversation?.id}`);
      }
    }
  };

  useEffect(() => {
    getGroups();
  }, []);

  return (
    <GroupsContext.Provider
      value={{ groups, setGroups, getGroups, conversation, getConversation }}
    >
      {children}
    </GroupsContext.Provider>
  );
};
