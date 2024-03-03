const express = require("express");
const { chats } = require("./data/dummy.js");
const connectDB = require("./config/db.js");
const colors = require("colors");
const dotenv = require("dotenv");
const userRoutes = require("./Routes/userRoutes.js");
const messageRoutes = require("./Routes/messageRoutes.js");
const chatRoutes = require("./Routes/chatRoutes.js");
const { notFound, errorHandler } = require("./middleware/errorMiddleware.js");
const { Socket } = require("socket.io");
const path = require("path");
dotenv.config();

// connection to mongoDB
connectDB();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log(`server is listening...${PORT}`.blue.bold)
);

// routes
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// ------------------Deployment------------------

const dirname = path.resolve();
if (process.env.NODE_ENV) {
  app.use(express.static(path.join(dirname, "/frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(dirname, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.json("Api is running successfully");
  });
}

// ------------------Deployment------------------

// error Handling middlewares
app.use(notFound);
app.use(errorHandler);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    // origin: "http://localhost:3000",
    origin: ["http://localhost:3000", "https://chatty-95lb.onrender.com"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connection");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("user joined room: " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));

  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;

    if (!chat.users) return console.log("chat.users is not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.off("setup", (userData) => {
    console.log("User Disconnected");
    socket.leave(userData._id);
  });
});
