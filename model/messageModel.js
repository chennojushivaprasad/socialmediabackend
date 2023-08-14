import mongoose from "mongoose";
const { Schema } = mongoose;

const messageSchema = new Schema({
  conversationId: { type: Schema.Types.ObjectId, ref: "Conversation" },
  content: { type: String, required: true }, // String is shorthand for {type: String}
  date: { type: Date, default: Date.now },
  senderId: { type: Schema.Types.ObjectId, ref: "User" },
});

export default mongoose.model("Message", messageSchema);
