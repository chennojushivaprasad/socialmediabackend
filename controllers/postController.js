import mongoose from "mongoose";

import User from "../model/userModel.js";
import Post from "../model/postModel.js";
import Like from "../model/likeModel.js";
import Comment from "../model/commentModel.js";

export const getPost = async (req, res, next) => {
  const { postId, userId } = req.params;

  let isLiked;
  try {
    const data = await Like.findOne({ userId, postId });
    if (data) {
      isLiked = true;
    } else {
      isLiked = false;
    }
  } catch (error) {
    console.log(error);
  }

  let post;
  try {
    post = await Post.findById(postId);
    const data = { ...post?._doc, isLiked };
    
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.json({ message: "Something went wrong" });
  }
};

export const getReels = async (req, res, next) => {

  let reels;
  try {
    reels = await Post.find({ "media.mediaType": "video" });

    return res.status(200).json({ reels });
  } catch (error) {
    console.log(error);
    return res.json({ message: "Something went wrong" });
  }
};

export const getAllPosts = async (req, res, next) => {
  let posts;
  try {
    posts = await Post.find();
    return res.status(200).json({ posts });
  } catch (error) {
    return res.json({ message: "Something went wrong" });
  }
};

export const addPost = async (req, res, next) => {
  const { id: userId } = req.params;
  const { userName, userImage, postMediaUrl, mediaType, caption } = req.body;

  let existingUser;
  try {
    existingUser = await User.findById(userId);
  } catch (error) {
    return console.log("error", error);
  }

  const post = new Post({
    userName,
    userImage,
    userId,
    media: {
      mediaType: mediaType,
      mediaUrl: postMediaUrl,
    },
    caption,
    comments: [],
    likes: [],
    date: new Date(),
  });

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    const data = await post.save({ session });
    existingUser.posts.push(data._id);
    await existingUser.save({ session });
    await session.commitTransaction();

    return res.status(200).json("added succesffully");
  } catch (error) {
    console.log(error);
  }

  return res.status(500).json({ message: "not able to upload" });
};

export const deletePost = async (req, res, next) => {
  const { id: postId, userId } = req.params;
  // const { userName, userImage, postMediaUrl,mediaType,caption } = req.body;

  let existingUser;
  try {
    existingUser = await User.findById(userId);
    
  } catch (error) {
    return console.log("error", error);
  }

  let existingPost;
  try {
    existingPost = await Post.findByIdAndDelete(postId);
    console.log(existingPost);
  } catch (error) {
    return console.log("error", error);
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await Like.deleteMany({ postId });
    await Comment.deleteMany({ postId });

    await User.updateOne(
      { _id: userId },
      {
        $pullAll: {
          posts: [{ _id: postId }],
        },
      }
    );
    await session.commitTransaction();

    return res.status(200).json("deleted succesffully");
  } catch (error) {
    console.log(error);
  }

  return res.status(500).json({ message: "not able to delete" });
};
