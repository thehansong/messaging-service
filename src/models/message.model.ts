/***********************************************
 * MESSAGE MODEL
 * brief: Defines the structure of a message object.
 * 
 * Functionalities:
 * - Stores essential details of a message,
 * - Tracks sender, recipient, content, and timestamp,
 * - Maintains message status (delivered, read, failed).
 ***********************************************/
export interface Message {
  id: string;
  sender: string;
  recipient: string;
  content: string;
  status: "delivered" | "read" | "failed";
  timestamp: Date;
}
