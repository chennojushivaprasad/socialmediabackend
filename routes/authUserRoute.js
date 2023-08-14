import express from "express";
import { login, signUp } from "../controllers/authController.js";


const authuserRouter = express()

authuserRouter.post("/signup",signUp)
authuserRouter.post("/login",login)

export default authuserRouter