const connectDatabase = require("./db/db");
const express = require("express");
const fs = require('fs');
const app = express();
const http = require("http");
const socket = require("socket.io");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/message");

connectDatabase();
const PORT = 8080;
const cors = require("cors");

app.use(express.json());
app.use(express.static(__dirname + "/uploads"))
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const server = app.listen(8080, () => console.log(`Server started on ${PORT}`));

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

var onlineUsers = <any>new Map();
let chatSocket: any;
global.onlineUsers = onlineUsers;


io.on("connection", (socket: any) => {
  socket.on("add-user", (userId: any) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data: any) => {
    console.log(data.to);
    const userSocketId = getUserSocketId(data.to);
    console.log('user socket', userSocketId);
    if (userSocketId) {
      io.to(userSocketId).emit("msg-recieve", data.msg);
    }
  });

  function getUserSocketId(userId: string): string | null {
    const userSocketId = onlineUsers.get(userId);
    return userSocketId ? userSocketId : null;
  }

  socket.on("upload", (data:any, callback:any) => {
    console.log(data.to);
    const userSocketId = getUserSocketId(data.to);
    console.log('user socket', userSocketId);
    if (userSocketId) {
      io.to(userSocketId).emit("msg-recieve1", data.image.image);
    }
  });
  


});
