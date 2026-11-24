import {createAvatar} from "@dicebear/core";
import {adventurer} from "@dicebear/collection";


export const generateAvatar =(isChatBot, userId, gender) => {
  const chatBotProfilePicture = "https://img.freepik.com/free-vector/chatbot-chat-message-vectorart_78370-4104.jpg";

if(isChatBot){
  return chatBotProfilePicture
}

  const avatar = createAvatar(adventurer,{
    seed : userId.toString(),
    hairProbability : 100,
    ...(gender === "male" ? {
      hair : ["short01", "short02", "short03", "short04", "short05"],
     features : ["mustache"],
     featuresProbability : 100,
      earringsProbability: 0
    } : {
      hair : ["long01", "long02", "long03", "long04", "long05"],
      featuresProbability : 0,
      earringsProbability: 100
    })
  });

   return avatar.toDataUri();

}