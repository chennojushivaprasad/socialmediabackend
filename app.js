import express from "express";
import mongoose from "mongoose";
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routes/userRoute.js";
import authUserRouter from "./routes/authUserRoute.js";
import postRouter from "./routes/postRoute.js";
import likeRouter from "./routes/likeRoute.js";
import commentRouter from "./routes/commentRoute.js";
import conversationRouter from "./routes/conversationRoute.js";
import messageRouter from "./routes/messageRoute.js";

dotenv.config();

const PORT = 3005 || process.env.PORT;

const app = express();

app.use(
  cors({
    origin: "https://insta-replica.netlify.app",
  })
);

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "https://insta-replica.netlify.app",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

app.use(express.json());

app.use("/api/auth", authUserRouter);

app.use("/api/user", userRouter);

app.use("/api/post", postRouter);

app.use("/api/post", likeRouter);

app.use("/api/post/comment", commentRouter);

app.use("/api/conversation", conversationRouter);

app.use("/api/message", messageRouter);

const MONGODB_URL = process.env.MONGODB_URL;

mongoose
  .connect(MONGODB_URL)
  .then((respone) => console.log("connected to database"))
  .catch((error) => console.log(error));

let Users = [];
io.on("connection", function (socket) {
  socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });

  socket.on("addUser", (userId) => {
    const exists = Users.some((user) => user.userId === userId);

    if (!exists) {
      const newUser = { userId, socketId: socket.id };
      Users.push(newUser);
      socket.emit("getUser", Users);
    }
  });

  socket.on("outgoingCall", (data) => {
    const { recipientId, senderId } = data;

    const senderExists = Users.find((user) => user.userId === senderId);
    const recipientExists = Users.find((user) => user.userId === recipientId);

    if (recipientExists && senderExists) {
      const recepientSocketID = recipientExists.socketId;

      io.to(recepientSocketID).emit("incomingCall", {
        ...data,
        senderSocketID: senderExists.socketId,
      });
    }
  });

  socket.on("acceptedCall", (data) => {
    const { senderSocketID, answer, senderId, recipientId } = data;
    io.to(senderSocketID).emit("answeredCall", {
      answer,
      senderId,
      recipientId,
    });
  });

  socket.on("sendMessage", function (data) {
    const { senderId, recipientId } = data;
    const recieverexists = Users.find((user) => user.userId === recipientId);

    const senderexists = Users.find((user) => user.userId === senderId);

    if (recieverexists || senderexists) {
      const recipientSocketID = recieverexists?.socketId;
      const senderSocketID = senderexists?.socketId;
      io.to(recipientSocketID).to(senderSocketID).emit("getMessage", data);
    }
  });

  // Send a message after a timeout of 4seconds

  socket.on("disconnect", function () {
    Users = Users.filter((user) => user.socketId !== socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log("server running at", PORT);
});
