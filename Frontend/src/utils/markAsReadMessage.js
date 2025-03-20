import axios from "axios";
import { BACKEND_API_URL } from "./constant";

export async function markMessageAsRead(selectedConversation) {
  if (selectedConversation) {
    try {
      await axios.get(
        `${BACKEND_API_URL}/messages/read/${selectedConversation._id}`,
        { withCredentials: true }
      );
    } catch (err) {
      console.log(err);
    }
  }
}
