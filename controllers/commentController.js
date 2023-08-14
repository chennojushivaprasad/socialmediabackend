import Comment from "../model/commentModel.js";
import User from "../model/userModel.js";
import Post from "../model/postModel.js";
import mongoose from "mongoose";

export const addComment = async (req, res, next) => {
  const { id: postId } = req.params;
  const { userId, commentText } = req.body;

  let existingUser;
  try {
    existingUser = await User.findById(userId);
    if (existingUser === null) {
      return res.status(401).json("unauthorized access");
    }
  } catch (error) {
    return console.log("error", error);
  }

  const comment = new Comment({
    userId,
    postId,
    commentText,
  });

  let existingPost;
  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    existingPost = await Post.findById(postId);

    const data = await comment.save({ session });
    existingPost.comments.push(data._id);
    existingPost.meta.comments = existingPost.comments.length;
    await existingPost.save({ session });
    await session.commitTransaction();

    return res.status(200).json(comment);
  } catch (error) {
   
    return res.json({ message: "Something went wrong" });
  }
};

export const getComment = async (req, res, next) => {
  
  const { commentId } = req.params;
  console.log(id);

  let comment;
  try {
    comment = await Comment.findById(id);
    console.log(comment);
    return res.status(200).json(comment);
  } catch (error) {
    console.log("error get comment", error);
    return res.status(401).json("something went wrong");
  }
};
