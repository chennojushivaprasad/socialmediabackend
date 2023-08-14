import mongoose from "mongoose";
const { Schema } = mongoose;

const commentSchema = new Schema({
  commentText: { type: String, required: true }, // String is shorthand for {type: String}
  date: { type: Date, default: Date.now },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  postId: { type: Schema.Types.ObjectId, ref: "Post" },
});

export default mongoose.model("Comment", commentSchema);
