import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface ICreateMessage {
  content: string;
  name: string;
  userId: number;
  groupId: string;
}

class Message {
  public async createMessage(MessageValues: ICreateMessage) {
    const { content, name, userId, groupId } = MessageValues;

    try {
      if (!content || !name || !userId || !groupId) {
        return {
          data: null,
          valid: false,
          message: "All fields are required.",
        };
      }

      const userExists = await prisma.user.findUnique({
        where: { id: userId },
      });

      const groupExists = await prisma.userGroup.findUnique({
        where: { id: groupId },
      });

      if (!userExists) {
        return { data: null, valid: false, message: "User not found." };
      }

      if (!groupExists) {
        return { data: null, valid: false, message: "Group not found." };
      }

      const newMessage = await prisma.message.create({
        data: {
          content,
          name,
          userId: Number(userId),
          groupId,
          timestamp: new Date(),
        },
      });

      return {
        valid: true,
        data: newMessage,
        message: "message created !",
      };
    } catch (error) {
      console.error("Error creating message:", error);
      return { data: null, valid: false, message: "Internal Server Error" };
    }
  }
}

export default new Message();
