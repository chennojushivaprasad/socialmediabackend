import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  userName: { type: String, required: true }, // String is shorthand for {type: String}
  email: { type: String, required: true },
  userImage:{type:String,default:""},
  createdDate: { type: Date, default: Date.now },
  followers:[{ type: Schema.Types.ObjectId, ref: "User" }],
  following:[{ type: Schema.Types.ObjectId, ref: "User" }],
  userImage: { type: String },
  password: { type: String, required: true },
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
});

export default mongoose.model("User", userSchema);
