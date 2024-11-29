import AuthenticateToken from "../Middleware/Authenticate.js";
import express from "express";

const Token = express();

Token.get("/Token", AuthenticateToken, (req, res) => {
  const TokenData = req.user;
  res.status(200).json(TokenData);
});

export default Token;
