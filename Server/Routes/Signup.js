import express from "express";
import User from "../Modals/User.js";

const SignUp = express();

SignUp.post("/signup", async (req, res) => {
  const { name, email, password, UniqueUsername } = req.body;
  console.log(req.body);

  const data = {
    name: name,
    email: email,
    password: password,
    UniqueUsername: UniqueUsername,
  };
  try {
    const UniqueUser = await User.findOne({ UniqueUsername: UniqueUsername });
    const CheckUser = await User.findOne({ email: email });

    if (CheckUser || UniqueUser) {
      res.status(200).json({ msg: "try dfferent Username or email", valid: false });
    } else {
      await User.insertMany(data);
      console.log("User Added");
      res.status(200).json({ msg: "User added", valid: true });
    }
  } catch (error) {
    console.log(error);
  }
});

export default SignUp;
