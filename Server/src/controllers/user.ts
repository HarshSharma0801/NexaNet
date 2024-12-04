import express from "express";
import { prismaDbClient } from "..";

class User {
  public async getUserById(req: express.Request, res: express.Response) {
    const { id } = req.query;

    try {
      const user = await prismaDbClient.user.findUnique({
        where: { id: Number(id) },
      });

      if (!user) {
        return res.status(404).json({ message: "Group not found" });
      }

      return res.status(200).json({ valid: true, id: user.id });
    } catch (error) {
      console.error("Error fetching group:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  public async getUserByName(req: express.Request, res: express.Response) {
    const { name } = req.query;
    if (Array.isArray(name) || typeof name !== "string") {
      return res.status(404).json({ message: "user not found" });
    }
    try {
      const user = await prismaDbClient.user.findUnique({
        where: { username: name },
      });

      if (!user) {
        return res
          .status(200)
          .json({ valid: false, message: "user not found" });
      }

      return res.status(200).json({
        valid: true,
        user: {
          realName: user.name,
          name: user.username,
          email: user.email,
          avatar: user.avatar,
          id: user.id,
          isGroup: user.isGroup,
        },
      });
    } catch (error) {
      console.error("Error fetching group:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export default new User();
