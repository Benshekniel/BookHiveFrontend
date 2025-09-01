import React, { useState } from 'react';
import { MessageCircle, Send, Search, User, Clock, CheckCheck } from 'lucide-react';

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const conversations = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Donor',
      avatar: 'SJ',
      lastMessage: 'The books are ready for shipment. I\'ll send the tracking number once dispatched.',
      timestamp: '2 hours ago',
      unread: 2,
      status: 'online'
    },
    {
      id: 2,
      name: 'BookHive Moderator',
      role: 'Moderator',
      avatar: 'BM',
      lastMessage: 'Your request for Mathematics textbooks has been approved and forwarded to potential donors.',
      timestamp: '1 day ago',
      unread: 0,
      status: 'offline'
    },
    {
      id: 3,
      name: 'Dr. Michael Chen',
      role: 'Donor',
      avatar: 'MC',
      lastMessage: 'I have some additional science books that might interest you. Would you like me to include them?',
      timestamp: '2 days ago',
      unread: 1,
      status: 'online'
    },
    {
      id: 4,
      name: 'Education First Foundation',
      role: 'Organization',
      avatar: 'EF',
      lastMessage: 'Thank you for participating in our book drive event. Here are the photos from the event.',
      timestamp: '3 days ago',
      unread: 0,
      status: 'offline'
    }
  ];

  const messages = {
    1: [
      {
        id: 1,
        sender: 'Sarah Johnson',
        message: 'Hi! I saw your request for Mathematics Grade 10 textbooks. I have exactly what you need.',
        timestamp: '10:30 AM',
        isOwn: false
      },
      {
        id: 2,
        sender: 'You',
        message: 'That\'s wonderful! We need 25 copies for our students. Are they in good condition?',
        timestamp: '10:45 AM',
        isOwn: true
      },
      {
        id: 3,
        sender: 'Sarah Johnson',
        message: 'Yes, they\'re brand new with answer keys included. I can ship them this week.',
        timestamp: '11:00 AM',
        isOwn: false
      },
      {
        id: 4,
        sender: 'You',
        message: 'Perfect! Please let me know the shipping details and tracking information.',
        timestamp: '11:15 AM',
        isOwn: true
      },
      {
        id: 5,
        sender: 'Sarah Johnson',
        message: 'The books are ready for shipment. I\'ll send the tracking number once dispatched.',
        timestamp: '2:30 PM',
        isOwn: false
      }
    ]
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && selectedChat) {
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Donor': return 'text-success';
      case 'Moderator': return 'text-primary';
      case 'Organization': return 'text-accent';
      default: return 'text-gray-600';
    }
  };

  const getStatusColor = (status) => {
    return status === 'online' ? 'bg-success' : 'bg-gray-400';
  };

  return (
    <div className="h-[calc(100vh-8rem)]">
      <div className="flex h-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Conversations List */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-xl font-heading font-semibold text-textPrimary mb-4">Messages</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedChat(conversation.id)}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                  selectedChat === conversation.id ? 'bg-accent/5' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-medium">
                      {conversation.avatar}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(conversation.status)} rounded-full border-2 border-white`}></div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-textPrimary truncate">{conversation.name}</h3>
                      <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate flex-1">{conversation.lastMessage}</p>
                      {conversation.unread > 0 && (
                        <span className="ml-2 bg-primary text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                    
                    <p className={`text-xs mt-1 ${getRoleColor(conversation.role)}`}>
                      {conversation.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-medium">
                      {conversations.find(c => c.id === selectedChat)?.avatar}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(conversations.find(c => c.id === selectedChat)?.status)} rounded-full border-2 border-white`}></div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-textPrimary">
                      {conversations.find(c => c.id === selectedChat)?.name}
                    </h3>
                    <p className={`text-sm ${getRoleColor(conversations.find(c => c.id === selectedChat)?.role)}`}>
                      {conversations.find(c => c.id === selectedChat)?.role}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {(messages[selectedChat] || []).map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.isOwn
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-textPrimary'
                    }`}>
                      <p className="text-sm">{message.message}</p>
                      <div className={`flex items-center justify-end mt-1 space-x-1 ${
                        message.isOwn ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        <span className="text-xs">{message.timestamp}</span>
                        {message.isOwn && <CheckCheck className="h-3 w-3" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            /* No Chat Selected */
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                <p className="text-gray-500">Choose a conversation from the list to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;