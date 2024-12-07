import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class Member {
  public async createMember(req: express.Request, res: express.Response) {
    const { userId, groupId, code } = req.body;

    try {
      if (!userId || !groupId || !code) {
        return res.status(200).json({
          message: "Invalid group or code.",
          valid: false,
          newMember: null,
        });
      }

      const group = await prisma.userGroup.findUnique({
        where: { id: groupId },
      });

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!group || group.code !== code || (!group.isGroup && !user)) {
        return res.status(200).json({
          message: "Invalid group or code.",
          valid: false,
          newMember: null,
        });
      }

      const newMember = await prisma.member.create({
        data: {
          userId,
          userGroupId: groupId,
          name: user?.username || "Default Name",
          avatar: user?.avatar,
        },
      });

      res.status(201).json({
        message: "Member created successfully.",
        newMember,
        valid: true,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error." });
    }
  }

  public async deleteMember(req: express.Request, res: express.Response) {
    const { memberId } = req.body;
    try {

      const member = await prisma.member.delete({
        where: {
          id: memberId,
        },
      });
      res.status(200).json({
        message: "Member deleted successfully.",
        valid: true,
        member
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
}

export default new Member();
