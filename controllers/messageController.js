// import Comment from "../model/commentModel.js";
// import User from "../model/userModel.js";
// import Post from "../model/postModel.js";
// import mongoose from "mongoose";
import Message from "../model/messageModel.js";

// export const addMessage = async (req, res, next) => {

//   const { senderId ,content,conversationId} = req.body;

//   console.log("add comment")

//   let existingUser;
//   try {
//     existingUser = await User.findById(userId);
//     if(existingUser === null){
//         return res.status(401).json("unauthorized access")
//     }
//     console.log("user exists",existingUser);
//   } catch (error) {
//     return console.log("error", error);
//   }

//   const message = new Message({
//     senderId,
//     content
//   });

//   let existingPost;
//   try {
//     const session = await mongoose.startSession();
//     session.startTransaction();

//     console.log("start session")
//     existingPost = await Post.findById(postId);

//     const data = await comment.save({ session });
//     existingPost.comments.push(data._id);
//    existingPost.meta.comments = existingPost.comments.length
//     await existingPost.save({ session });
//     await session.commitTransaction();

//     return res.status(200).json(comment);
//   } catch (error) {
//     console.log(error);
//     return res.json({ message: "Something went wrong" });
//   }
// };

export const addMessage = async (req, res, next) => {
   const {senderId,conversationId} = req.params

  const { content } = req.body;
  const message = new Message({
    content,
    senderId,
    conversationId,
  });

  try {
    const data = await message.save();
    return res.status(200).json("added succesfully");
  } catch (error) {
    return res.status(400).json({ message: "something went wrong" });
  }
};

export const fetchAllChats = async (req, res, next) => {
  const { conversationId } = req.params;

  let message;
  try {
    message = await Message.find({conversationId});
    if (message === null) return res.status(200).json([]);

    return res.status(200).json(message);
  } catch (error) {
    return res.status(401).json("something went wrong");
  }
};
