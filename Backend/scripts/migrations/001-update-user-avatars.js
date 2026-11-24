import mongoose from "mongoose";

import dotenv from "dotenv";
import { User } from "../../models/user.model.js";
import connectDB from "../../config/mongoose-connection.js";
import { generateAvatar } from "../../utils/generateAvatar.js";


dotenv.config();


const chatbotRegex = /^chatbot$/i

async function updateUserAvatars(){
    try{
        await connectDB();

        const users = await User.find().select("-password");

        for(let i = 0; i<= users.length- 1; i++){
            const user = users[i];
            const isChatBot = chatbotRegex.test(user.username);
            user.profilePhoto = generateAvatar(isChatBot, user._id, user.gender);

            await user.save();
        }



        await mongoose.connection.close();

    }catch(err){
        console.log("Error updating user avatars", err);
        await mongoose.connection.close();
    }
}


await updateUserAvatars();