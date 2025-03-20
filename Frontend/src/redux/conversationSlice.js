import { createSlice } from "@reduxjs/toolkit";

const conversationSlice = createSlice({
  name: "conversation",
  initialState: {
    selectedConversation: null,
    messages: [],
  },
  reducers: {
    setSelectedConversation: (state, action) => {
      state.selectedConversation = action.payload;
    },
    setMessages: (state, action) => {
      if (typeof action.payload === "function") {
        // Handle functional updates
        state.messages = action.payload(state.messages);
      } else {
        // Append a single message or an array of messages
        if (Array.isArray(action.payload)) {
          state.messages = action.payload;
        } else {
          state.messages = [...state.messages, action.payload];
        }
      }
    },

    updateMessageStatus: (state, action) => {
      state.messages = state.messages.map((message) =>
        (message.receiverId === action.payload.receiverId &&
          message.status === "sent") ||
        (message.senderId === action.payload.senderId &&
          message.receiverId === action.payload.receiverId)
          ? { ...message, status: action.payload.status }
          : message
      );
    },
  },
});

export const { setSelectedConversation, setMessages, updateMessageStatus } =
  conversationSlice.actions;

export default conversationSlice.reducer;
