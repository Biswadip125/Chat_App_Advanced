import mongoose from "mongoose";

const chatbotSchema = new mongoose.Schema({
  input: {
    type: String,
    require: true,
    unique: true,
  },
  output: {
    type: String,
    require: true,
  },
});

export const ChatbotResponse = mongoose.model("ChatbotResponse", chatbotSchema);
