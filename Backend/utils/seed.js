import { ChatbotResponse } from "../models/chatbot.model.js";

const responses = [
  {
    input: "Hi",
    output: "Hello there! How can I help you?",
  },
  {
    input: "What is your name?",
    output: "I'm your friendly chatbot! You can call me ChatBuddy.",
  },

  {
    input: "Tell me a fun fact",
    output:
      "Did you know that honey never spoils? Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly good!",
  },
  {
    input: "How do I learn programming?",
    output:
      "You can start by learning a beginner-friendly language like Python or JavaScript. Websites like freeCodeCamp, Codecademy, and W3Schools are great places to begin!",
  },
  {
    input: "What is 5 + 7?",
    output: "5 + 7 equals 12!",
  },
];

export const seedDatabase = async () => {
  try {
    await ChatbotResponse.insertMany(responses);
    console.log("Chat bot responses seeded");
  } catch (error) {
    console.log(error);
  }
};
