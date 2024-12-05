import express from "express";
import auth from "../controllers/auth";
import userGroup from "../controllers/user-group";
import user from "../controllers/user";
import message from "../controllers/message";
const router = express.Router();

router.post("/signup", auth.signup);
router.post("/login", auth.login);
router.get("/token", auth.token);

router.post("/createUserGroup", userGroup.createUserGroup);
router.get("/fetchUserGroups", userGroup.fetchGroups);
router.post("/checkUserGroup", userGroup.checkMemberShip);
router.get("/userGroup/:id", userGroup.getUserGroupById);
router.get("/userGroup", userGroup.getUserGroupByName);

router.get("/user/:id", user.getUserById);
router.get("/user", user.getUserByName);

router.post("/createMessage", message.createMessage);

export default router;
