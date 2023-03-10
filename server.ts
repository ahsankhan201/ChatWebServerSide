const connectDatabase = require("./db/db");
const express = require("express");
const app = express();
const http = require("http");
const socket = require("socket.io");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/message");

connectDatabase();
const PORT = 8080;
const cors = require("cors");

app.use(express.json());
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

global.onlineUsers = new Map();
io.on("connection", (socket: any) => {
  // chatSocket = socket;
  socket.on("add-user", (userId: any) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data: any) => {
    const sendUserSocket = onlineUsers.get(data.to);
    console.log(sendUserSocket);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});










