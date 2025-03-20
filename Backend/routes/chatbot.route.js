import express from "express";
import { chatbotResponse } from "../controllers/chatbotResponse.controller.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.post("/:id", isAuthenticated, chatbotResponse);

export default router;
