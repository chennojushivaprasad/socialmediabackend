import mongoose from "mongoose";
import User from "../model/userModel.js";

export const getUser = async (req, res, next) => {
  const { id: userId } = req.params;
  let user;

  try {
    user = await User.findById(userId);
  } catch (error) {
    console.log(" error", error);
    return res.status(401).json("error");
  }

  if (user !== null) {
    return res.status(200).json({ user });
  }
  return res.status(401).json({ mesage: "something went wrong" });
};

export const getSearchUser = async (req, res, next) => {
  const { search } = req.query;
  const searchedValue = search
    ? {
        userName: {
          $regex: new RegExp(search, "i"),
        },
      }
    : {};
  try {
    const data = await User.find(searchedValue);

    if (data.length > 0) {
      return res.status(200).json(data);
    } else {
      return res.status(400).json("no data found");
    }
  } catch {
    return res.stat(401).json("something went wrong");
  }
};

export const addFollow = async (req, res, next) => {
  const { userId, followId } = req.body;
  console.log("follow");
  let user;
  let followUser;
  try {
    user = await User.findById(userId);
    followUser = await User.findById(followId);
  } catch (error) {
    console.log(" error", error);
    return res.status(401).json("error");
  }

  let data;

  try {
    data = await User.updateOne(
      { following: followId },
      {
        $pullAll: {
          following: [{ _id: followId }],
        },
      }
    );

    if (data.matchedCount !== 0) {
      console.log(data);
      return res.status(200).json({ message: "updated successfully" });
    }
  } catch (error) {
    return console.log(error);
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    user.following.push(followId);
    console.log("follow added");
    await user.save({ session });
    followUser.followers.push(userId);
    await followUser.save({ session });
    await session.commitTransaction();
    return res.status(200).json("added to follow list");
  } catch (error) {
    return res.status(400).json("error");
  }
};

export const updateUser = async (req, res, next) => {
  const {userId} = req.params
  const { userName, userImage } = req.body;
  try {
    await User.updateOne({ _id: userId }, { $set: { username: userName,userImage:userImage } });
    return res.status(200).json({message:"updated successfully"})
  } catch (error) {
    return;
  }
};
