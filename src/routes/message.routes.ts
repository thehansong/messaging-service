import express, { Router } from "express";
import { sendMessage, getMessages, updateMessageStatus, getChatMessages } from "../controllers/message.controller";


/***********************************************
 * MESSAGE ROUTES
 * brief: Defines API endpoints for message-related operations.
 * 
 * Functionalities:
 * - Send a new message,
 * - Retrieve messages for a user or chat,
 * - Update message status if its delivered, read, failed.
 ***********************************************/
const router: Router = express.Router();

router.post("/", sendMessage);                              // Send a new message
router.get("/user/:userId", getMessages);                   // Get all messages for a user
router.get("/chat/:chatId", getChatMessages);               // Get messages for a specific chat
router.patch("/:messageId/status", updateMessageStatus);    // Update message status

export default router;
