import express from "express";
import { prismaDbClient } from "..";
import { v4 as uuidv4 } from "uuid";

class UserGroup {
  public async createUserGroup(req: express.Request, res: express.Response) {
    const { name, userId } = req.body;

    if (!name || !userId) {
      return res.status(400).json({ error: "Name and userId are required" });
    }

    try {
      const groupCode = uuidv4();

      const newUserGroup = await prismaDbClient.userGroup.create({
        data: {
          name: name,
          code: groupCode,
          isGroup: true,
          adminId: userId,
        },
      });

      const member = await prismaDbClient.member.create({
        data: {
          userId: userId,
          userGroupId: newUserGroup.id,
        },
      });

      return res.status(200).json({
        valid: true,
        message: "User group created",
        code: newUserGroup.code,
        member: member.id,
      });
    } catch (error) {
      console.error("Error creating user group:", error);
      res.status(500).json({ error: "Internal server error", valid: false });
    }
  }
}

export default new UserGroup();
