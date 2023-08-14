import { addComment ,getComment} from "../controllers/commentController.js";
import { authentication } from "../middleWare/index.js";

import express from "express";

const commentRouter = express()
commentRouter.use(authentication)

commentRouter.post("/addComment/:id",addComment)
commentRouter.get("/:commentId",getComment)

export default commentRouter