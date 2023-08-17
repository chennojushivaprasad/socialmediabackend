import { getSearchUser, getUser ,follow,unFollow} from "../controllers/userController.js";
// import { authentication } from "../middleWare/index.js";

import express from "express";

const userRouter = express()
// userRouter.use(authentication)

userRouter.get("/:id",getUser)

userRouter.get("/",getSearchUser)

userRouter.put("/follow",follow)
userRouter.put("/unfollow",unFollow)

export default userRouter