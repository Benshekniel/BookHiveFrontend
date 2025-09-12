import React, { useState, useEffect } from "react";
import { MessageSquare, Send, User, Check } from "lucide-react";

const Messages = () => {
  // Mock current user data
  const currentUser = {
    id: 1,
    name: "Nive",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  };

  // Mock messages data grouped by conversation
  const initialConversations = [
    {
      id: 1,
      participants: [
        { id: 2, name: "Samantha Perera", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" },
        { id: 1, name: "Nive" },
      ],
      messages: [
        {
          id: 1,
          senderId: 2,
          content: "Hi Nive! Are you interested in borrowing my book 'Atomic Habits'?",
          timestamp: "2024-06-24 10:30",
          read: false,
        },
        {
          id: 2,
          senderId: 1,
          content: "Yes, I'd love to borrow it. When can we arrange this?",
          timestamp: "2024-06-24 11:00",
          read: true,
        },
        {
          id: 3,
          senderId: 2,
          content: "How about this weekend? Let me know what works for you!",
          timestamp: "2024-06-24 11:15",
          read: false,
        },
      ],
      lastMessage: "How about this weekend? Let me know what works for you!",
      lastTimestamp: "2024-06-24 11:15",
    },
    {
      id: 2,
      participants: [
        { id: 3, name: "Ravi Kumar", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" },
        { id: 1, name: "Nive" },
      ],
      messages: [
        {
          id: 4,
          senderId: 3,
          content: "Hey Nive, do you have 'The Alchemist' for sale?",
          timestamp: "2024-06-23 14:20",
          read: true,
        },
        {
          id: 5,
          senderId: 1,
          content: "Yes, I do! It's Rs. 500. Interested?",
          timestamp: "2024-06-23 14:30",
          read: true,
        },
      ],
      lastMessage: "Yes, I do! It's Rs. 500. Interested?",
      lastTimestamp: "2024-06-23 14:30",
    },
  ];

  // State for conversations, selected conversation, and new reply
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [reply, setReply] = useState("");

  // Auto-scroll to the latest message when conversation changes
  useEffect(() => {
    if (selectedConversation) {
      const chatContainer = document.getElementById("chat-container");
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }
  }, [selectedConversation, conversations]);

  // Handle reply input change
  const handleReplyChange = (e) => {
    setReply(e.target.value);
  };

  // Handle sending a reply
  const handleSendReply = (e) => {
    e.preventDefault();
    if (reply.trim() && selectedConversation) {
      const newMessage = {
        id: Math.max(...selectedConversation.messages.map((m) => m.id)) + 1,
        senderId: currentUser.id,
        content: reply,
        timestamp: new Date().toLocaleString("en-US", { timeZone: "Asia/Colombo" }),
        read: false,
      };
      const updatedConversations = conversations.map((conv) =>
        conv.id === selectedConversation.id
          ? { ...conv, messages: [...conv.messages, newMessage], lastMessage: reply, lastTimestamp: newMessage.timestamp }
          : conv
      );
      setConversations(updatedConversations);
      setReply("");
      setSelectedConversation((prev) => ({ ...prev, messages: [...prev.messages, newMessage] }));
    }
  };

  // Select a conversation
  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    // Mark all messages as read for this conversation
    const updatedConversations = conversations.map((conv) =>
      conv.id === conversation.id
        ? { ...conv, messages: conv.messages.map((msg) => ({ ...msg, read: true })) }
        : conv
    );
    setConversations(updatedConversations);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-900 rounded-xl p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold mb-2">Messages</h1>
              <p className="text-blue-100 text-lg">Connect with other readers and sellers</p>
            </div>
          </div>
        </div>

        {/* Messages Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat List (Left Sidebar) */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-900">Chats</h2>
              </div>
            </div>
            <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto">
              {conversations.map((conversation) => {
                const otherParticipant = conversation.participants.find((p) => p.id !== currentUser.id);
                return (
                  <div
                    key={conversation.id}
                    className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => handleSelectConversation(conversation)}
                  >
                    <img
                      src={otherParticipant.avatar}
                      alt={otherParticipant.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-gray-900">{otherParticipant.name}</h3>
                        <p className="text-xs text-gray-500">{conversation.lastTimestamp}</p>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-1">{conversation.lastMessage}</p>
                      {!conversation.messages.some((msg) => !msg.read) && (
                        <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full"></span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chat Box (Right Section) */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedConversation
                    ? conversations.find((c) => c.id === selectedConversation.id)?.participants.find((p) => p.id !== currentUser.id)
                        ?.name
                    : "Select a chat"}
                </h2>
              </div>
            </div>
            <div
              id="chat-container"
              className="p-6 max-h-[60vh] overflow-y-auto space-y-4"
            >
              {selectedConversation ? (
                selectedConversation.messages.map((message) => {
                  const isSentByUser = message.senderId === currentUser.id;
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isSentByUser ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`p-3 rounded-lg max-w-[70%] ${
                          isSentByUser
                            ? "bg-yellow-100 text-gray-900"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs text-gray-500 mt-1">{message.timestamp}</p>
                        {isSentByUser && (
                          <span className="text-xs text-gray-500 flex items-center">
                            <Check className="w-3 h-3 mr-1" /> Sent
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Select a chat to start messaging</p>
                </div>
              )}
            </div>
            {selectedConversation && (
              <form
                onSubmit={handleSendReply}
                className="p-6 border-t border-gray-100 flex space-x-2"
              >
                <input
                  type="text"
                  value={reply}
                  onChange={handleReplyChange}
                  placeholder="Type a message..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <button
                  type="submit"
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
                  disabled={!reply.trim()}
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
