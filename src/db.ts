import { Message } from "./models/message.model";
import { Chat } from "./models/chat.model";


/***********************************************
 * IN-MEMORY DATABASE
 * brief: Stores users, messages, and chat data in memory.
 * 
 * Functionalities:
 * - Maintains a predefined list of users,
 * - Stores messages and chat data temporarily,
 * - Provides a reset function for debugging/testing.
 ***********************************************/
export const users = ["user1", "user2", "user3", "user4"];    // Hardcoded users for test

// Inmemory storage
export let messages: Message[] = [];
export let chats: Chat[] = [];

// Function to reset database for tesitng
export const resetDatabase = () => {
  messages = [];
  chats = [];
};
 