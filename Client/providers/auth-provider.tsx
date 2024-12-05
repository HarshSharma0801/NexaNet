"use client";

import { useRouter } from "next/navigation";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  password: string;
  avatar: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  const router = useRouter();

  useEffect(() => {
    const Rawdata = localStorage.getItem("UserData");
    if (!Rawdata) {
      router.push("/");
    } else {
      const UserData = JSON.parse(Rawdata);
      setUser(UserData.UserInfo);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useAuthContext = (): UserContextType => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useAuthContext must be used within a UserProvider");
  }

  return context;
};
