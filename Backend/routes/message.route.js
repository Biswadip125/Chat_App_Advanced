import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import {
  getMessage,
  markMessageAsRead,
  sendMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

router.post("/send/:id", isAuthenticated, sendMessage);

router.get("/:id", isAuthenticated, getMessage);

router.get("/read/:id", isAuthenticated, markMessageAsRead);

export default router;
