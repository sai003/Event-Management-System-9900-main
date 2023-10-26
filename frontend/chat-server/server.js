/*
NOTE: The code in the file was cloned from the code in the following GitHub Repository:
https://github.com/divofred/ChatTutorial
It was then customised for the EvenTastic Project.
*/
const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});
const { addUser, removeUser } = require("./user");

const PORT = 9090;

io.on("connection", (socket) => {
  socket.on("join", ({ userName, groupName }, callBack) => {
    const { user, error } = addUser({ id: socket.id, name: userName, room: groupName });
    if (error) return callBack(error);

    socket.join(user.room);
    socket.emit("message", {
      user: "evenTastic",
      text: `Welcome to ${user.room}`,
    });

    socket.broadcast
      .to(user.room)
      .emit("message", { user: "evenTastic", text: `${user.name} has joined!` });
    callBack(null);

    socket.on("sendMessage", ({ message }) => {
      io.to(user.room).emit("message", {
        user: user.name,
        text: message,
      });
    });
  });
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    console.log(user);
    io.to(user.room).emit("message", {
      user: "evenTastic",
      text: `${user.name} has left the group chat.`,
    });
    console.log("User disconnected.");
  });
});

server.listen(PORT, () => console.log(`Server is Connected to Port ${PORT}`));
