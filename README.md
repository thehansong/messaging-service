# Toku Messaging Service Assessment

## Features I've Completed!:
- **Messaging**: Send messages between users
- **Chat Management**: Create and view chats between users
- **Message Status**: Track message delivery status (delivered, read, and failed)
- **Chat History**: Retrieve complete message history for chats
- **User Chat List**: View all chats a user is participating in
- **Chat Metadata**: Access detailed information about each chat
- **Rate Limiting**: Protect API from abuse with configurable rate limiting



## 1. Setup Instructions

### Prerequisites

Ensure you have the following installed:
- Node.js
- npm
- Docker (optional, for containerized deployment)

### Docker Setup
#### Build the Docker Image
```sh
docker build -t messaging-service .
```
#### Run the container
```sh
docker run -p 5000:5000 messaging-service
```

### Testing the API
I have created and generated nine simple test cases for this assessment with the assistance of ChatGPT.
The easiest way to test all features is to use the included test script:
#### Execute Test Script
```sh
chmod +x TEST_API.sh
```
#### Run the Test Script
```sh
./TEST_API.sh
```



## 2. API Documentation

**Base URL:** 
```sh
http://localhost:5000
```

### Messages API

| Endpoint                          | Method  | Description                       | Request Body                                        | Response                      |
|-----------------------------------|--------|-----------------------------------|----------------------------------------------------|------------------------------|
| `/messages`                       | POST   | Send a new message               | `{ "sender": "user1", "recipient": "user2", "content": "Hello!" }` | Message object               |
| `/messages/user/:userId`          | GET    | Get all messages for a user      | `-`                                                | Array of message objects     |
| `/messages/chat/:chatId`          | GET    | Get all messages in a chat       | `-`                                                | Array of message objects     |
| `/messages/:messageId/status`     | PATCH  | Update message status            | `{ "status": "read" }`                              | Updated message object       |

### Chats API

| Endpoint                      | Method  | Description                  | Request Body | Response                               |
|--------------------------------|--------|------------------------------|--------------|----------------------------------------|
| `/chats/user/:userId`         | GET    | Get all chats for a user     | `-`          | Array of chat objects with metadata  |
| `/chats/:chatId`              | GET    | Get chat metadata            | `-`          | Chat metadata object                 |

---

## Response Objects

### **Message Object**
```json
{
  "id": "string",
  "sender": "string",
  "recipient": "string",
  "content": "string",
  "status": "delivered" OR "read" OR "failed", (depends on message status)
  "timestamp": "Date"
}
```

### **Chat Metadata Object**
```json
{
  "id": "string",
  "participants": ["string", "string"],
  "messageCount": "number",
  "createdAt": "Date",
  "lastActivity": "Date",
  "unreadCount": "number",
  "participantStats": [
    {
      "userId": "string",
      "messagesSent": "number",
      "messagesReceived": "number"
    }
  ]
}
```

### **Chat Object**
```json
{
  "id": "string",
  "participants": ["string", "string"],
  "messages": ["string"]
}
```


## 3. Technical Choices and System Architecture
### Tech Stack
- TypeScript  
- Express.js  

I chose TypeScript because I'm familiar with it, and its built-in type safety helps reduce potential bugs compared to JavaScript. :)

For the backend, Express.js was used because of its lightweight nature and suitability for handling REST APIs in this project scope.  

Since this is a relatively simple prototype, I went with in-memory storage for now—it keeps things fast and straightforward. In a production environment, this would likely be swapped for a proper database.  

I also implemented rate limiting, ensuring that requests are throttled appropriately.  

### System Architecture  
This is a stateless REST API, meaning each request is handled independently without storing session data.  
The chat system follows a one-on-one messaging model.  




