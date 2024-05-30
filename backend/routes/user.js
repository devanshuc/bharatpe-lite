// backend/routes/user.js
const express = require("express");

const router = express.Router();
const z = require("zod");
const { User } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = "../config";

const signUpBody = z.object({
  username: z.string().email(),
  f_name: z.string(),
  l_name: z.string(),
  password: z.string(),
});

router.post("./signup", async (req, res) => {
  const { success } = signUpBody.safeParse(req.body);
  if (!success) {
    return res
      .status(411)
      .json({ message: "Email already taken or incorrect inputs." });
  }

  const existingUser = await User.findOne({ username: req.body.username });
  if (existingUser) {
    return res.status(411).json({ message: "Username already taken." });
  }

  const user = await User.create({
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.f_name,
    lastName: req.body.l_name,
  });

  const userId = user._id;

  const token = jwt.sign({ User }, JWT_SECRET);

  res.json({ message: "User successfully created.", token: token });
});

module.exports = router;
