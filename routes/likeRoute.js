import { updateLike } from "../controllers/likeController.js";
import { authentication } from "../middleWare/index.js";

import express from "express";

const likeRouter = express()
likeRouter.use(authentication)

likeRouter.post("/updatelike",updateLike)

export default likeRouter