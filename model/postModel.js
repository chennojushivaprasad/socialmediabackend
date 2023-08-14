import mongoose from "mongoose";
const { Schema } = mongoose;

const postSchema = new Schema({
  userName: { type: String, required: true }, // String is shorthand for {type: String}
  userImage:{type:String},
  userId:{type:Schema.Types.ObjectId,ref:"User"},
  // email:{type:String,required:true},
  media:{
    mediaType:{type:String,required:true},
    mediaUrl:{type:String,required:true}
  },
  caption:{type:String},
  likes: [{ type: Schema.Types.ObjectId, ref:"Like" }],
  comments: [{ type: Schema.Types.ObjectId, ref:"Comment"}],
  date: { type: Date, default: Date.now },
  meta: {
    likes: {type:Number,default:0},
    comments:{type:Number,default:0}
  },
});

export default mongoose.model("Post",postSchema)