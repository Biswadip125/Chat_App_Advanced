import { ChatbotResponse } from "../models/chatbot.model.js";
import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { id: receiverId } = req.params;
    const { message } = req.body;

    let getConversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!getConversation) {
      getConversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const receiverUser = await User.findOne({ _id: receiverId });

    const isBot = /^chatbot$/i.test(receiverUser.fullname);

    const newMessage = await Message.create({
      senderId,
      receiverId,
      message,
      status: isBot ? "read" : "sent",
    });

    if (newMessage) {
      getConversation.messages.push(newMessage._id);
    }
    await Promise.all([getConversation.save(), newMessage.save()]);

    //SOCKET IO
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
      newMessage.status = "delivered";
      await newMessage.save();
    }

    res.status(201).json({ newMessage });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error", success: false });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    //finding the conversation between the two peoples(it means you and the guy who is chatting with you ) and populate the mesasges so that the actual nessages can be seen
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("messages");

    //storing the messages from the conversation
    const messages = conversation?.messages;

    //sending back the messages to the user
    return res.status(200).json({ messages });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const markMessageAsRead = async (req, res) => {
  try {
    const { id: senderId } = req.params;
    const receiverId = req.user._id;

    await Message.updateMany(
      { senderId, receiverId, status: "delivered" },
      { $set: { status: "read" } }
    );

    const senderSocektId = getReceiverSocketId(senderId);
    if (senderSocektId) {
      io.to(senderSocektId).emit("messageRead", { senderId, receiverId });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};
