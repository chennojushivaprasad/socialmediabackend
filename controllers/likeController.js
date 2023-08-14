import User from "../model/userModel.js";
import Like from "../model/likeModel.js";
import Post from "../model/postModel.js";
import mongoose from "mongoose";

export const updateLike = async (req, res, next) => {
  const { userId, postId } = req.body;

  let user;
  let existingPost;

  try {
    user = await User.findById(userId);
    if (user !== null) {
      existingPost = await Post.findById(postId);
    } else {
      return res.json({ message: "user does not exist" });
    }
  } catch (error) {
    return res.status(401).json("error");
  }

  let liked = false;
  let existsLike;

  try {
    existsLike = await Like.find({ postId, userId });
    if (existsLike !== []) {
      liked = true;
    }
  } catch (error) {
    console.log(error);
  }

  if (liked) {
    try {
      const id = existsLike[0]._id;
      const session = await mongoose.startSession();
      session.startTransaction();
      await  Post.findByIdAndUpdate(
        postId,
        { $pull: { likes: id } },
        { new: true }
      )

      existingPost.meta.likes -= 1;
      await Like.findByIdAndDelete(id);
      await existingPost.save({ session });
      await session.commitTransaction();

      return res.status(200).json(existingPost);
    } catch (error) {
      console.log(error);
    }
  }

  const like = new Like({
    userId,
    postId,
  });

  try {
    
    const session = await mongoose.startSession();
    session.startTransaction();
    const data = await like.save({ session });
    existingPost.likes.push(data._id);
    existingPost.meta.likes += 1 ;
    await existingPost.save({ session });
    await session.commitTransaction();

    return res.status(200).json(existingPost);
  } catch (error) {
    console.log(error);
  }
};
