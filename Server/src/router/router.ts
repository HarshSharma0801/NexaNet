import express from "express";
import auth from "../controllers/auth";

const router = express.Router();

router.post("/signup", auth.signup);
router.post("/login", auth.login);
router.get("/token", auth.token);

export default router;
