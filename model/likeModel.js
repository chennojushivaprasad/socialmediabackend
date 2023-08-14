import mongoose from "mongoose";
const { Schema } = mongoose;

const likeSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  postId: { type: Schema.Types.ObjectId, ref: "Post" },
});

export default mongoose.model("Like", likeSchema);
