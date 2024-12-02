export interface User {
  id: number;
  email: string;
  name: string;
  username: string;
  password: string;
  isGroup: Boolean;
  avatar: string;
}

export interface Group {
  id: string;
  name: string;
  code?: string;
  isGroup: boolean;
  created_at: string;
  adminId: number;
  Message: {
    id: number;
    content: string;
    timestamp: Date;
    userId: number;
    groupId: string;
    name: string;
  }[];
  Member: {
    userId: number;
    name: string;
  }[];
}

export interface Message {
  id: number;
  content: string;
  timestamp: Date;
  userId: number;
  groupId: string;
  name: string;
  user?: User;
}
