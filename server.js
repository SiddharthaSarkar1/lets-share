const express = require("express");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

const app = express();
const server = require("http").createServer(app);

const io = require("socket.io")(server);

dotenv.config();

const PORT = process.env.PORT ||5000;

app.use(express.static(path.join(__dirname + "/public")));

io.on("connection", function (socket) {
  socket.on("sender-join", function (data) {
    socket.join(data.uid);
  });
  socket.on("receiver-join", function (data) {
    socket.join(data.uid);
    socket.in(data.sender_uid).emit("init", data.uid);
  });
  socket.on("file-meta", function (data) {
    socket.in(data.uid).emit("fs-meta", data.metadata);
  });
  socket.on("fs-start", function (data) {
    socket.in(data.uid).emit("fs-share", {});
  });
  socket.on("file-raw", function (data) {
    socket.in(data.uid).emit("fs-share", data.buffer);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
