import { addPost, deletePost, getAllPosts,getPost, getReels } from "../controllers/postController.js";
import { authentication } from "../middleWare/index.js";

import express from "express";

const postRouter = express()
postRouter.use(authentication)

postRouter.post("/:id/add",addPost)

postRouter.get("/",getAllPosts)

postRouter.get("/reels",getReels)


postRouter.get("/:postId/:userId",getPost)

postRouter.delete("/:id/:userId",deletePost)


export default postRouter