import express from "express";
import auth from "../controllers/auth";
import userGroup from "../controllers/user-group";

const router = express.Router();

router.post("/signup", auth.signup);
router.post("/login", auth.login);
router.get("/token", auth.token);

router.post("/createUserGroup", userGroup.createUserGroup);

export default router;
