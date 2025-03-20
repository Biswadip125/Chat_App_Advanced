import axios from "axios";
import { BACKEND_API_URL } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { setMessages } from "../redux/conversationSlice";
import { useState } from "react";
const useSendMessage = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const selectedConversation = useSelector(
    (store) => store.conversation.selectedConversation
  );
  const chatbotRegex = /^chatbot$/i;

  const sendMessage = async (message) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${BACKEND_API_URL}/messages/send/${selectedConversation._id}`,
        { message },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const newMessage = res.data.newMessage;
      dispatch(setMessages((prevMessages) => [...prevMessages, newMessage]));

      // another api call if the receiver is bot
      if (chatbotRegex.test(selectedConversation.fullname)) {
        setTimeout(async () => {
          const botRes = await axios.post(
            `${BACKEND_API_URL}/chatbot/${selectedConversation._id}`,
            { message },
            {
              headers: {
                "Content-Type": "application/json",
              },
              withCredentials: true,
            }
          );
          const botReply = botRes.data.botMessage;

          dispatch(setMessages((prevMessages) => [...prevMessages, botReply]));
        }, 1000);
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  return { loading, sendMessage };
};

export default useSendMessage;
