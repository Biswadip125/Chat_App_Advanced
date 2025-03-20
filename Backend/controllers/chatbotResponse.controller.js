import { ChatbotResponse } from "../models/chatbot.model.js";
import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";

export const chatbotResponse = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { id: receiverId } = req.params;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    const chatbotResponse = await ChatbotResponse.findOne({
      input: { $regex: new RegExp("^" + message + "$", "i") },
    });

    const botReply = chatbotResponse
      ? chatbotResponse.output
      : "I'm not sure how to respond, can you ask something else ";

    //store chatbot response in DB

    const botMessage = await Message.create({
      senderId: receiverId,
      receiverId: senderId,
      message: botReply,
    });

    let getConversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    //save to the conversation
    getConversation.messages.push(botMessage._id);
    await getConversation.save();

    res.status(200).json({
      botMessage,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
