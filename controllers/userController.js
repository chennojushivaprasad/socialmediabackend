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

export const follow = async (req, res, next) => {
  const { userId, followId } = req.body;

  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    const opts = { session };
    
    await User.findByIdAndUpdate(
      followId,
      { $addToSet: { followers: userId } },
      opts
    );

    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { following: followId } },
      { new: true, session }
    );

    await session.commitTransaction();
    session.endSession();
    res.status(200).json({message:"followed"})
  } catch (error) {
    return console.log(error);
  }
};

export const unFollow = async (req, res, next) => {
  const { userId, unfollowId } = req.body;

  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    const opts = { session };

    // Update the user being unfollowed (remove userId from their followers)
    await User.findByIdAndUpdate(
      unfollowId,
      { $pull: { followers: userId } },
      opts
    );

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { following: unfollowId } },
      { new: true, session }
    )
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({message:"unfollowed"})
  } catch (error) {
    return console.log(error);
  }
};

export const updateUser = async (req, res, next) => {
  const { userId } = req.params;
  const { userName, userImage } = req.body;
  try {
    await User.updateOne(
      { _id: userId },
      { $set: { username: userName, userImage: userImage } }
    );
    return res.status(200).json({ message: "updated successfully" });
  } catch (error) {
    return;
  }
};
