 /***********************************************
 * CHAT MODEL
 * brief: Defines the structure of a chat object.
 * 
 * Functionalities:
 * - Represents a private conversation between two users,
 * - Stores message IDs to link to messages in the chat,
 * - Ensures exactly two participants per chat.
 ***********************************************/
export interface Chat {
  id: string;
  participants: [string, string];                   // 2 users
  messages: string[];                               // store msg IDs
}
