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

