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

      return res.status(200).json({ valid: true, groups: modifiedGroups });
    } catch (error) {
      console.error("Error fetching user groups:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  public async checkMemberShip(req: express.Request, res: express.Response) {
    const { userId, groupId } = req.body;

    try {
      const group = await prismaDbClient.userGroup.findUnique({
        where: { id: groupId },
        include: {
          Message: {
            orderBy: { timestamp: "desc" },
            take: 20,
          },
          Member: {
            select: {
              userId: true,
              name: true,
            },
          },
        },
      });

      if (!group) {
        return res
          .status(404)
          .json({ valid: false, message: "Group not found" });
      }

      if (group.isGroup) {
        const isMember = group.Member.some(
          (member) => member.userId === Number(userId)
        );

        if (!isMember) {
          return res.status(403).json({
            valid: false,
            message: "User is not a member of the group",
          });
        }
        return res.status(200).json({ valid: true, group });
      } else {
        const otherMember = group.Member.find(
          (member) => member.userId !== Number(userId)
        );

        if (!otherMember) {
          const user = await prismaDbClient.user.findUnique({
            where: { id: Number(userId) },
          });
          const otherUser = await prismaDbClient.user.findUnique({
            where: { id: Number(groupId) },
          });

          if (!user || !otherUser) {
            return res.status(404).json({
              valid: false,
              message: "User or other member not found",
            });
          }

          const newGroup = await prismaDbClient.userGroup.create({
            data: {
              isGroup: false,
              adminId: Number(userId),
              Member: {
                create: [
                  { userId: Number(userId), name: user.name },
                  { userId: Number(groupId), name: otherUser.name },
                ],
              },
            },
            include: {
              Member: true,
              Message: true,
            },
          });
          newGroup.adminId = user.id;
          newGroup.name = otherUser.name;
          return res.status(200).json({ valid: true, group: newGroup });
        }
        group.adminId = userId;
        group.name = otherMember.name;
        return res.status(200).json({ valid: true, group });
      }
    } catch (error) {
      console.error("Error checking membership:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  public async getUserGroupById(req: express.Request, res: express.Response) {
    const { id } = req.params;

    try {
      const userGroup = await prismaDbClient.userGroup.findUnique({
        where: { id: id },
        include: {
          Message: {
            include: {
              user: true,
            },
          },
          Member: true,
        },
      });

      if (!userGroup) {
        return res.status(404).json({ message: "Group not found" });
      }

      return res.status(200).json({ valid: true, group: userGroup });
    } catch (error) {
      console.error("Error fetching group:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export default new UserGroup();
