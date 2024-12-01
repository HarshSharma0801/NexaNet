import express from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const accessKey = process.env.JWT_ACCESS || "default";

class AuthController {
  private prismaClient: PrismaClient;
  constructor() {
    this.prismaClient = new PrismaClient();
  }
  signup = async (req: express.Request, res: express.Response) => {
    const { name, email, password, username } = req.body;
    const Userdata = {
      name,
      email,
      password,
      avatar:"",
      username,
    };
    try {
      const UniqueUser = await this.prismaClient.user.findUnique({
        where: { username: username },
      });
      const CheckUser = await this.prismaClient.user.findUnique({
        where: { email: email },
      });

      if (CheckUser || UniqueUser) {
        res
          .status(200)
          .json({ msg: "try dfferent Username or email", valid: false });
      } else {
        const user = await this.prismaClient.user.create({
          data: Userdata,
        });
        console.log("User Added");
        res
          .status(200)
          .json({ msg: "User added", valid: true, username: user.username });
      }
    } catch (error) {
      console.log(error);
    }
  };

  login = async (req: express.Request, res: express.Response) => {
    const { password, username } = req.body;

    try {
      const Userdata = await this.prismaClient.user.findFirst({
        where: {
          username: username,
          password: password,
        },
      });

      if (Userdata) {
        const accessToken = jwt.sign({ Userdata }, accessKey, {
          expiresIn: "2d",
        });

        res
          .status(200)
          .json({ access: accessToken, UserInfo: Userdata, valid: true });
      } else {
        res.status(200).json({ valid: false });
      }
    } catch (error) {
      console.log(error);
    }
  };

  authenticateToken = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(200).json({ valid: false });
    }

    jwt.verify(token, accessKey, (err, user) => {
      if (err) {
        return res.sendStatus(403); // Forbidden
      }
      req.user = user;
      next();
    });
  };
}


export default new AuthController();