import { Server } from "socket.io";
import http from "http";
import express from "express";
import { Message } from "../models/message.model.js";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("a user is connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId !== undefined) {
    userSocketMap[userId] = socket.id;
  }

  socket.on("userConnected", async () => {
    //update message status from sent to delivered
    await Message.updateMany(
      {
        receiverId: userId,
        status: "sent",
      },
      { $set: { status: "delivered" } }
    );

    //Notify senders that messages are delivered
    const senderIds = await Message.distinct("senderId", {
      receiverId: userId,
      status: "delivered",
    });

    senderIds.forEach((senderId) => {
      const senderSocketId = getReceiverSocketId(senderId);
      if (senderSocketId) {
        io.to(senderSocketId).emit("messageDelivered", { receiverId: userId });
      }
    });
  });

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, io, server };
