import { addConversation, getConversation } from "../controllers/conversationControllers.js";
import { authentication } from "../middleWare/index.js";

import express from "express";

const conversationRouter = express()
conversationRouter.use(authentication)

conversationRouter.post("/:senderId/:recipientId",addConversation)
conversationRouter.get("/:senderId/:recipientId",getConversation)

export default conversationRouter