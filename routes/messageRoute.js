import { addMessage, fetchAllChats } from "../controllers/messageController.js";
import { authentication } from "../middleWare/index.js";

import express from "express";

const messageRouter = express()
messageRouter.use(authentication)

messageRouter.get("/:conversationId",fetchAllChats)
messageRouter.post("/addMessage/:senderId/:conversationId",addMessage)

export default messageRouter