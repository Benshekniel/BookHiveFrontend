import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, Search, User, Clock, CheckCheck } from 'lucide-react';
import messageService from '../../services/messageService';

const ORG_ID = 1; // TODO: Replace with real orgId/hubManagerId from context or props

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch conversations from backend (e.g., donors, moderators, etc.)
      const convs = await messageService.getHubConversations(ORG_ID);
      const convArray = Array.isArray(convs) ? convs : [];
      setConversations(convArray.map(conv => ({
        id: conv.id || conv.userId || conv.conversationId,
        name: conv.name || conv.userName || conv.displayName || 'User',
        avatar: (conv.name || conv.userName || 'U').split(' ').map(n => n[0]).join('').toUpperCase(),
        lastMessage: conv.lastMessage || '',
        timestamp: conv.timestamp || '',
        unread: conv.unread || 0,
        status: conv.status || 'offline',
        ...conv
      })));
      // Initialize empty messages for all conversations
      const initialMessages = {};
      convArray.forEach(conv => {
        const id = conv.id || conv.userId || conv.conversationId;
        initialMessages[id] = [];
      });
      setMessages(initialMessages);
    } catch (err) {
      setError('Failed to load conversations');
      setConversations([]);
      setMessages({});
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId, partnerId) => {
    setLoading(true);
    setError(null);
    try {
      const msgs = await messageService.getConversation(ORG_ID, partnerId);
      setMessages(prev => ({ ...prev, [conversationId]: Array.isArray(msgs) ? msgs : [] }));
    } catch (err) {
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChat = (conversation) => {
    setSelectedChat(conversation);
    fetchMessages(conversation.id, conversation.partnerId || conversation.id);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() && selectedChat) {
      setLoading(true);
      setError(null);
      try {
        await messageService.sendMessage({
          senderId: ORG_ID,
          receiverId: selectedChat.partnerId || selectedChat.id,
          content: newMessage
        });
        fetchMessages(selectedChat.id, selectedChat.partnerId || selectedChat.id);
        setNewMessage('');
      } catch (err) {
        setError('Failed to send message');
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                onClick={() => handleSelectChat(conversation)}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                  selectedChat?.id === conversation.id ? 'bg-accent/5' : ''
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
                      {conversations.find(c => c.id === selectedChat.id)?.avatar}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(conversations.find(c => c.id === selectedChat.id)?.status)} rounded-full border-2 border-white`}></div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-textPrimary">
                      {conversations.find(c => c.id === selectedChat.id)?.name}
                    </h3>
                    <p className={`text-sm ${getRoleColor(conversations.find(c => c.id === selectedChat.id)?.role)}`}>
                      {conversations.find(c => c.id === selectedChat.id)?.role}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages[selectedChat.id]?.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === ORG_ID ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.senderId === ORG_ID
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-textPrimary'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <div className={`flex items-center justify-end mt-1 space-x-1 ${
                        message.senderId === ORG_ID ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        <span className="text-xs">{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}</span>
                        {message.senderId === ORG_ID && <CheckCheck className="h-3 w-3" />}
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
                    disabled={!newMessage.trim() || loading}
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Sending...' : <Send className="h-4 w-4" />}
                  </button>
                </form>
                {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
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