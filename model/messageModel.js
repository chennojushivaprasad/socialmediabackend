import mongoose from "mongoose";
const { Schema } = mongoose;

const messageSchema = new Schema({
  conversationId: { type: Schema.Types.ObjectId, ref: "Conversation" }, // String is shorthand for {type: String}
  date: { type: Date, default: Date.now },
  text: { type: String, default: null },
  audio: { type: String, default: null },
  video: {
    url: { type: String },
    thumbnail: { type: String },
    caption: { type: String },
  },
  image: {
    url: { type: String },
    caption: { type: String },
  },
  post: { type: Object, default: null },
  senderId: { type: Schema.Types.ObjectId, ref: "User" },
});

export default mongoose.model("Message", messageSchema);
