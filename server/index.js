const express = require("express");
const cors = require("cors");
const http = require("http");
const app = express();
const { Server } = require("socket.io");
app.use(cors());

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected at socket: ${socket.id}`);

  //listening to the emitted message from Client for joining room
  socket.on("join_room", (data) => {
    socket.join(data);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  //On Disconnection
  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

httpServer.listen(3001, () => {
  console.log("Server is listening at port 3001");
});
