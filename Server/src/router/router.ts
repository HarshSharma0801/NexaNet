import express from "express";
import auth from "../controllers/auth";
import userGroup from "../controllers/user-group";

const router = express.Router();

router.post("/signup", auth.signup);
router.post("/login", auth.login);
router.get("/token", auth.token);

router.post("/createUserGroup", userGroup.createUserGroup);
router.get("/fetchUserGroups", userGroup.fetchGroups);
router.post("/checkUserGroup", userGroup.checkMemberShip);
router.get("/userGroup/:id", userGroup.getUserGroupById);


export default router;
