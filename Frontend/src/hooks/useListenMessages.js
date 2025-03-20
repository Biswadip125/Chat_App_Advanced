import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import { useDispatch, useSelector } from "react-redux";
import { setMessages, updateMessageStatus } from "../redux/conversationSlice";

import notificationSound from "../assets/sounds/notification.mp3";
import { markMessageAsRead } from "../utils/markAsReadMessage";

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const messages = useSelector((store) => store.conversation.messages);
  const selectedConversation = useSelector(
    (store) => store.conversation.selectedConversation
  );
  const dispatch = useDispatch();
  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      newMessage.shouldShake = true;
      const sound = new Audio(notificationSound);
      sound.play();
      if (newMessage.senderId === selectedConversation._id) {
        dispatch(setMessages([...messages, newMessage]));
        markMessageAsRead(selectedConversation);
      }
    });

    socket?.on("messageRead", ({ senderId, receiverId }) => {
      console.log("messageRead");
      dispatch(updateMessageStatus({ senderId, receiverId, status: "read" }));
    });

    socket?.on("messageDelivered", ({ receiverId }) => {
      console.log("messageDeleivered");
      dispatch(updateMessageStatus({ receiverId, status: "delivered" }));
    });

    return () => {
      socket?.off("newMessage");
      socket?.off("readMessage");
      socket?.off("messageDelivered");
    };
  }, [socket, messages, dispatch]);
};

export default useListenMessages;
