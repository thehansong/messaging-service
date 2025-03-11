import express, { Router } from "express";
import { listChats, getChatMetadata } from "../controllers/chat.controller";


/***********************************************
 * CHAT ROUTES
 * brief: Defines API endpoints for chat-related operations.
 * 
 * Functionalities:
 * - Fetch all chats for a user,
 * - Retrieve detailed metadata for a specific chat.
 ***********************************************/
const router: Router = express.Router();

router.get("/user/:userId", listChats);           // List all chats for a user
router.get("/:chatId", getChatMetadata);          // Get detailed metadata for a specific chat (maybe need multi if more ?)

export default router;
