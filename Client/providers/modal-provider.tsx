"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface ModalContextType {
  open: boolean;
  setOpen: (state: boolean) => void;
  name: string | null;
  setName: (name: string | null) => void;
  id: string | null;
  setId: (id: string | null) => void;
  userId: string | null;
  setUserId: (id: string | null) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [name, setName] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  return (
    <ModalContext.Provider
      value={{ setUserId, userId, open, setOpen, name, setName, id, setId }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useJoinModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
