import { getSearchUser, getUser ,addFollow} from "../controllers/userController.js";
// import { authentication } from "../middleWare/index.js";

import express from "express";

const userRouter = express()
// userRouter.use(authentication)

userRouter.get("/:id",getUser)

userRouter.get("/",getSearchUser)

userRouter.put("/addFollow",addFollow)

export default userRouter