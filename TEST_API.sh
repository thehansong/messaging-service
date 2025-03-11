#!/bin/bash


# /***********************************************
# API TEST SCRIPT
# brief: Automates testing of the messaging service API.
# 
# Functionalities:
# - Sends messages between users,
# - Updates message statuses,
# - Retrieves user messages and chats,
# - Tests chat metadata and chat message retrieval.
# ***********************************************/
API_URL="http://localhost:5000"

call_api() {
    echo "🔹 $1"
    echo "📤 REQUEST: $2 $API_URL$3"
    if [ -n "$4" ]; then
        echo "📦 PAYLOAD: $4"
        response=$(curl -s -X "$2" "$API_URL$3" -H "Content-Type: application/json" -d "$4")
    else
        response=$(curl -s -X "$2" "$API_URL$3")
    fi
    echo "📥 RESPONSE:"
    echo "$response" | json_pp
    echo "-------------------------------------------"
    echo ""
    # Return the response for use in variables
    echo "$response"
}


# ***********************************************
# TEST 1: Send a message from user1 to user2
# ***********************************************
echo "Test 1: Sending a message from user1 to user2"
message1=$(call_api "Send Message" "POST" "/messages" '{"sender":"user1","recipient":"user2","content":"Hello user2, how are you today?"}')
message1_id=$(echo "$message1" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)


# ***********************************************
# TEST 2: Send a reply from user2 to user1
# ***********************************************
echo "Test 2: Sending a reply from user2 to user1"
message2=$(call_api "Send Reply" "POST" "/messages" '{"sender":"user2","recipient":"user1","content":"I am doing great, thanks for asking!"}')
message2_id=$(echo "$message2" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)


# ***********************************************
# TEST 3: Update message status to "read"
# ***********************************************
echo "Test 3: Updating message status to read"
call_api "Update Message Status" "PATCH" "/messages/$message1_id/status" '{"status":"read"}'


# ***********************************************
# TEST 4: Get messages for user1
# ***********************************************
echo "Test 4: Getting messages for user1"
call_api "Get User Messages" "GET" "/messages/user/user1"


# ***********************************************
# TEST 5: List chats for user1
# ***********************************************
echo "Test 5: Listing chats for user1"
chats_response=$(call_api "List Chats" "GET" "/chats/user/user1")
chat_id=$(echo "$chats_response" | grep -o '"id":"[^"]*"' | head -n1 | cut -d'"' -f4)


# ***********************************************
# TEST 6: Get chat metadata
# ***********************************************
echo "Test 6: Getting chat metadata"
call_api "Get Chat Metadata" "GET" "/chats/$chat_id"


# ***********************************************
# TEST 7: Get chat messages
# ***********************************************
echo "Test 7: Getting chat messages"
call_api "Get Chat Messages" "GET" "/messages/chat/$chat_id"


# ***********************************************
# TEST 8: Send a message from user1 to user3 (new chat)
# ***********************************************
echo "Test 8: Creating a new chat (user1 to user3)"
call_api "New Chat Message" "POST" "/messages" '{"sender":"user1","recipient":"user3","content":"Hey user3, this is a new chat!"}'


# ***********************************************
# TEST 9: List all chats for user1 again and will have 2.
# ***********************************************
echo "Test 9: Listing all chats for user1 again"
call_api "List All Chats" "GET" "/chats/user/user1"
echo "API Test Completed Successfully!"
