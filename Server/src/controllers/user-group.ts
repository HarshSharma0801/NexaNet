import express from "express";
import { prismaDbClient } from "..";
import { v4 as uuidv4 } from "uuid";

class UserGroup {
  public async createUserGroup(req: express.Request, res: express.Response) {
    const { name, userId, username } = req.body;

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
          name: username,
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

  public async fetchGroups(req: express.Request, res: express.Response) {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    try {
      const userGroups = await prismaDbClient.userGroup.findMany({
        where: {
          OR: [
            { adminId: Number(userId) },
            { Member: { some: { userId: Number(userId) } } },
          ],
        },
        include: {
          Message: {
            orderBy: {
              timestamp: "desc",
            },
            take: 1,
          },
          Member: {
            select: {
              userId: true,
              name: true,
            },
          },
        },
        take: 10,
      });

      const modifiedGroups = userGroups.map((group) => {
        if (!group.isGroup) {
          const otherMember = group.Member.find(
            (member) => member.userId !== Number(userId)
          );

          if (otherMember) {
            group.name = otherMember.name || "Unnamed";
          }
        }
        return group;
      });

      return res.status(200).json({valid:true, groups:modifiedGroups});
    } catch (error) {
      console.error("Error fetching user groups:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default new UserGroup();
