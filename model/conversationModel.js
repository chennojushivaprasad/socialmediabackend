import mongoose from "mongoose";
const { Schema } = mongoose;

const conversationSchema = new Schema({
  member: [{ type: Schema.Types.ObjectId, ref: "User" }],
  isGroupChat: { type: Boolean, default:false},
});

export default mongoose.model("Conversation", conversationSchema);
