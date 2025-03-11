import { Request, Response, NextFunction } from "express";
import { chats, users, messages } from "../db";


/***********************************************
 * LIST CHATS HANDLER
 * brief: Retrieves all chats that a user is participating in, along with metadata.
 * 
 * Functionalities:
 * - ensures user exists,
 * - fetches all chats where user is a participant,
 * - provides metadata such as last message preview and timestamp.
 ***********************************************/
export const listChats = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { userId } = req.params;

    // Validate if the user exists in the system
    if (!users.includes(userId)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    // Fetch chats where the user is a participant
    const userChats = chats.filter((chat) => chat.participants.includes(userId));
    
    // Add metadata to each chat
    const chatsWithMetadata = userChats.map(chat => {
      // Get the other participant
      const otherParticipant = chat.participants.find(p => p !== userId) || "";
      
      // Get last message only if available
      const lastMessageId = chat.messages.length > 0 ? chat.messages[chat.messages.length - 1] : null;
      const lastMessage = lastMessageId ? messages.find(m => m.id === lastMessageId) : null;
      
      return {
        id: chat.id,
        participants: chat.participants,
        messageCount: chat.messages.length,
        otherParticipant,
        lastMessagePreview: lastMessage ? 
          (lastMessage.content.length > 30 ? `${lastMessage.content.substring(0, 30)}...` : lastMessage.content) : 
          null,
        lastMessageTime: lastMessage ? lastMessage.timestamp : null
      };
    });
    
    res.status(200).json(chatsWithMetadata);
  } catch (error) {
    next(error);
  }
};


/***********************************************
 * GET CHAT METADATA HANDLER
 * brief: Retrieves metadata for a specific chat, including message statistics and timestamps.
 * 
 * Functionalities:
 * - ensures chat exists,
 * - fetches all messages in the chat,
 * - calculates metadata such as first and last message timestamps, unread counts, and per-user stats.
 ***********************************************/
export const getChatMetadata = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { chatId } = req.params;
    const chat = chats.find((c) => c.id === chatId);                                            // Look up the chat by ID
    
    if (!chat) {
      res.status(404).json({ error: "Chat not found" });
      return;
    }
    
    // Retrieve all messages belonging to this chat
    const chatMessages = messages.filter(msg => chat.messages.includes(msg.id));
    
    // Compute metadata, first and last message timestamps, unread count, and stats per participant
    const metadata = {
      id: chat.id,
      participants: chat.participants,
      messageCount: chat.messages.length,
      createdAt: chatMessages.length > 0 ? 
        new Date(Math.min(...chatMessages.map(m => m.timestamp.getTime()))) : 
        null,                                                                       // chat started here.
      lastActivity: chatMessages.length > 0 ? 
        new Date(Math.max(...chatMessages.map(m => m.timestamp.getTime()))) : 
        null,                                                                       // last msg sent
      unreadCount: chatMessages.filter(m => m.status !== "read").length,
      participantStats: chat.participants.map(participant => ({
        userId: participant,
        messagesSent: chatMessages.filter(m => m.sender === participant).length,
        messagesReceived: chatMessages.filter(m => m.recipient === participant).length
      }))
    };
    
    res.status(200).json(metadata);
  } catch (error) {
    next(error);
  }
};
