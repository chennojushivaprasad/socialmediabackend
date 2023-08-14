import User from "../model/userModel.js";
// import Cookies from "js-cookie"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signUp = async (req, res, next) => {
  const { userName,userImage, email, password } = req.body;

  let emailExists;

  try {
    emailExists = await User.findOne({ email });
  } catch (err) {
    return console.log(err);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    userName,
    userImage,
    email,
    password: hashedPassword,
    posts: [],
  });

  if (emailExists === null) {
    await user.save();
    return res.status(200).json({ message: "user registered successfully" });
  }
  return res.status(400).json({ message: "user already exists" });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  let user;

  try {
    user = await User.findOne({ email });
  } catch (error) {
    console.log("login failed error", error);
    return res.status(403).json({message:"something went wrong"})
  }

  if (user === null) {
    return res.status(401).json({ message: "user not exists" });
  }

  const match = await bcrypt.compare(password, user.password);

  if (match) {
    const payload = { userId: user._id }; //  payload => user information
    const secretKey = "MY_SECRET_TOKEN";
    const jwtToken = jwt.sign(payload, secretKey);
    return res
      .status(200)
      .json({ message: "access token", accessToken: jwtToken ,userId: user._id});
  }else{
    return res.status(401).json({message:"login failed"})
  }
};

