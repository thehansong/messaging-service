import { Request, Response, NextFunction } from "express";
import { messages, users, chats } from "../db";
import { Message } from "../models/message.model";
import { Chat } from "../models/chat.model";
import { v4 as uuidv4 } from "uuid";


/***********************************************
 * SEND MESSAGE HANDLER
 * brief: Handles sending a message from one user to another.
 * 
 * Functionalities:
 * - ensures users exist,
 * - prevents self-messaging,
 * - maintains chat history.
 ***********************************************/
export const sendMessage = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { sender, recipient, content } = req.body;

    // Validate ALL required fields
    if (!sender || !recipient || !content) {
      res.status(400).json({ error: "Missing required fields: sender, recipient, and content are required" });
      return;
    }

    // Validate sender and recipient exist
    if (!users.includes(sender) || !users.includes(recipient)) {
      res.status(400).json({ error: "Invalid sender or recipient" });
      return;
    }

    // Prevent users from msging themselves
    if (sender === recipient) {
      res.status(400).json({ error: "Cannot send message to self" });
      return;
    }

    // Create new message object
    const newMessage: Message = {
      id: uuidv4(),
      sender,
      recipient,
      content,
      status: "delivered",
      timestamp: new Date(),
    };

    messages.push(newMessage);

    // Find an existing chat between sender and recipient or create a new one*
    let chat = chats.find(
      (c) => 
        (c.participants[0] === sender && c.participants[1] === recipient) || 
        (c.participants[0] === recipient && c.participants[1] === sender)
    );

    if (!chat) {
      chat = {
        id: uuidv4(),
        participants: [sender, recipient] as [string, string],
        messages: [],
      };
      chats.push(chat);
    }

    chat.messages.push(newMessage.id);

    res.status(201).json(newMessage);
  } catch (error) {
    next(error);
  }
};


/***********************************************
 * GET USER MESSAGES HANDLER
 * brief: Retrieves all messages associated with a specific user.
 * 
 * Functionalities:
 * - fetches messages sent or received by the user,
 * - ensures user exists,
 * - returns the filtered messages.
 ***********************************************/
export const getMessages = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { userId } = req.params;
    
    // Validate if user exists
    if (!users.includes(userId)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }
    
    // Filter messages where the user is either sender or recipient
    const userMessages = messages.filter(
      (msg) => msg.sender === userId || msg.recipient === userId
    );
    
    res.status(200).json(userMessages);
  } catch (error) {
    next(error);
  }
};


/***********************************************
 * GET CHAT MESSAGES HANDLER
 * brief: Retrieves all messages within a specific chat.
 * 
 * Functionalities:
 * - ensures chat exists,
 * - fetches all messages within the chat,
 * - sorts messages chronologically.
 ***********************************************/
export const getChatMessages = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { chatId } = req.params;
    
    // Locate chat by ID
    const chat = chats.find((c) => c.id === chatId);
    if (!chat) {
      res.status(404).json({ error: "Chat not found" });
      return;
    }
    
    // Retrieve messages belonging to this chat
    const chatMessages = messages.filter((msg) => chat.messages.includes(msg.id));
    
    // Sort messages by timestamp to maintain chronological order
    chatMessages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    
    res.status(200).json(chatMessages);
  } catch (error) {
    next(error);
  }
};


/***********************************************
 * UPDATE MESSAGE STATUS HANDLER
 * brief: Updates the status of a message.
 * 
 * Functionalities:
 * - ensures message exists,
 * - validates allowed status values,
 * - updates the message status accordingly.
 ***********************************************/
export const updateMessageStatus = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { messageId } = req.params;
    const { status } = req.body;

    // Validate status
    if (!status || !["delivered", "read", "failed"].includes(status)) {
      res.status(400).json({ error: "Invalid status. Status must be one of: delivered, read, failed" });
      return;
    }

    // Locate message by ID
    const message = messages.find((msg) => msg.id === messageId);
    if (!message) {
      res.status(404).json({ error: "Message not found" });
      return;
    }

    // Update message status
    message.status = status;
    res.status(200).json(message);
  } catch (error) {
    next(error);
  }
};