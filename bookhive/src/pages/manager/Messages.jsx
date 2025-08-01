import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, Search, RefreshCw, Radio } from 'lucide-react';
import { agentApi, messageApi } from '../../services/deliveryService';

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hubId] = useState(1);
  const [hubManagerId] = useState(1);
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');

  // Fetch conversations and messages
  useEffect(() => {
    fetchConversations();
  }, [hubId]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching conversations from backend...');

      // Fetch agents from backend
      let agentsResponse;
      try {
        console.log('Trying to get agents by hub:', hubId);
        agentsResponse = await agentApi.getAgentsByHub(hubId);
      } catch (hubError) {
        console.warn('Hub agents failed, trying all agents:', hubError);
        agentsResponse = await agentApi.getAllAgents();
      }

      console.log('Raw agents response:', agentsResponse);

      // Handle different response formats
      let agentsArray = [];
      if (Array.isArray(agentsResponse)) {
        agentsArray = agentsResponse;
      } else if (agentsResponse && typeof agentsResponse === 'object') {
        agentsArray = agentsResponse.data || agentsResponse.content || agentsResponse.agents || agentsResponse.result || [];
      }

      console.log('Processed agents array:', agentsArray);

      if (agentsArray.length === 0) {
        setError('No agents found for this hub.');
        setConversations([]);
        setMessages({});
        return;
      }

      // Convert agents to conversations
      const agentConversations = agentsArray.map((agent, index) => {
        const getName = () => {
          if (agent.name) return agent.name;
          if (agent.userName) return agent.userName;
          if (agent.firstName && agent.lastName) return `${agent.firstName} ${agent.lastName}`;
          if (agent.firstName) return agent.firstName;
          if (agent.lastName) return agent.lastName;
          return `Agent ${agent.agentId || agent.id || index + 1}`;
        };

        const getAgentId = () => {
          return agent.agentId || agent.id || (index + 1);
        };

        const name = getName();
        const agentId = getAgentId();

        return {
          id: agentId,
          name: name,
          role: 'Agent',
          avatar: name.split(' ').map(n => n && n[0] ? n[0] : '').join('').toUpperCase() || 'A',
          lastMessage: 'No messages yet',
          timestamp: 'Never',
          unread: 0,
          status: agent.availabilityStatus === 'AVAILABLE' ? 'online' : 'offline',
          agentData: agent
        };
      });

      console.log('Created agent conversations:', agentConversations);
      setConversations(agentConversations);

      // Initialize empty messages for all conversations
      const initialMessages = {};
      agentConversations.forEach(conv => {
        initialMessages[conv.id] = [];
      });
      setMessages(initialMessages);

      // Load real messages for each agent
      await loadRealMessages(agentConversations);

    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError(`Failed to load conversations: ${err.message}`);
      setConversations([]);
      setMessages({});
    } finally {
      setLoading(false);
    }
  };

  const loadRealMessages = async (conversations) => {
    console.log('Loading real messages from backend...');
    const allMessages = {};

    for (const conv of conversations) {
      try {
        console.log(`Loading messages for agent ${conv.id}`);
        
        // Get conversation messages from backend
        const conversationMessages = await messageApi.getConversation(hubManagerId, conv.id);
        console.log(`Messages for agent ${conv.id}:`, conversationMessages);

        if (conversationMessages && conversationMessages.length > 0) {
          // Convert backend messages to UI format
          allMessages[conv.id] = conversationMessages.map(msg => ({
            id: msg.messageId || msg.id || Math.random().toString(36).substr(2, 9),
            sender: msg.senderId === hubManagerId ? 'You' : (msg.senderName || conv.name),
            message: msg.content || msg.message || '',
            timestamp: formatTimestamp(msg.createdAt || msg.timestamp),
            isOwn: msg.senderId === hubManagerId,
            isRead: msg.isRead || false
          }));

          // Update conversation with last message info
          const lastMessage = conversationMessages[conversationMessages.length - 1];
          const convIndex = conversations.findIndex(c => c.id === conv.id);
          if (convIndex !== -1) {
            conversations[convIndex].lastMessage = lastMessage.content || lastMessage.message || 'New message';
            conversations[convIndex].timestamp = formatTimestamp(lastMessage.createdAt || lastMessage.timestamp);

            // Count unread messages
            const unreadCount = conversationMessages.filter(msg =>
              msg.receiverId === hubManagerId && !msg.isRead
            ).length;
            conversations[convIndex].unread = unreadCount;
          }
        } else {
          // No messages yet
          allMessages[conv.id] = [];
        }
      } catch (error) {
        console.error(`Error loading messages for agent ${conv.id}:`, error);
        // Initialize empty conversation
        allMessages[conv.id] = [];
      }
    }

    console.log('All real messages loaded:', allMessages);
    setMessages(allMessages);
    setConversations([...conversations]); // Trigger re-render with updated conversation data
  };

  const formatTimestamp = (dateString) => {
    if (!dateString) return 'Unknown';

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Unknown';
      
      const now = new Date();
      const diffMinutes = Math.floor((now - date) / (1000 * 60));

      if (diffMinutes < 1) {
        return 'Just now';
      } else if (diffMinutes < 60) {
        return `${diffMinutes} min ago`;
      } else if (diffMinutes < 1440) {
        return `${Math.floor(diffMinutes / 60)} hours ago`;
      } else {
        return `${Math.floor(diffMinutes / 1440)} days ago`;
      }
    } catch (error) {
      return 'Unknown';
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    const messageContent = newMessage;
    const selectedConv = conversations.find(c => c.id === selectedChat);

    // Clear input immediately for better UX
    setNewMessage('');

    // Add message to UI immediately for better UX
    const tempMessage = {
      id: Date.now().toString(),
      sender: 'You',
      message: messageContent,
      timestamp: 'Just now',
      isOwn: true,
      isTemporary: true
    };

    setMessages(prev => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), tempMessage]
    }));

    try {
      // Send message to backend
      const messageData = {
        senderId: hubManagerId,
        receiverId: selectedChat,
        content: messageContent
      };

      console.log('Sending message to backend:', messageData);
      const sentMessage = await messageApi.sendMessage(messageData);
      console.log('Message sent successfully:', sentMessage);

      // Replace temporary message with real message
      const realMessage = {
        id: sentMessage.messageId || sentMessage.id || tempMessage.id,
        sender: 'You',
        message: messageContent,
        timestamp: formatTimestamp(sentMessage.createdAt || new Date().toISOString()),
        isOwn: true
      };

      setMessages(prev => ({
        ...prev,
        [selectedChat]: prev[selectedChat].map(msg => 
          msg.id === tempMessage.id ? realMessage : msg
        )
      }));

      // Update last message in conversation
      setConversations(prev =>
        prev.map(conv =>
          conv.id === selectedChat
            ? { ...conv, lastMessage: messageContent, timestamp: 'Just now', unread: 0 }
            : conv
        )
      );

    } catch (error) {
      console.error('Error sending message:', error);

      // Remove temporary message on error
      setMessages(prev => ({
        ...prev,
        [selectedChat]: prev[selectedChat].filter(msg => msg.id !== tempMessage.id)
      }));

      // Restore the message input on error
      setNewMessage(messageContent);

      // Show error to user
      setError('Failed to send message. Please try again.');
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleBroadcastMessage = async () => {
    if (!broadcastMessage.trim()) return;

    try {
      const messageData = {
        message: broadcastMessage,
        senderId: hubManagerId
      };

      console.log('Broadcasting message to backend:', messageData);
      await messageApi.broadcastMessage(hubId, messageData);

      setBroadcastMessage('');
      setShowBroadcast(false);

      // Show success message
      setError('Message broadcasted successfully to all agents!');
      setTimeout(() => setError(null), 3000);

      // Refresh conversations to show the new messages
      await fetchConversations();

    } catch (error) {
      console.error('Error broadcasting message:', error);
      setError('Failed to broadcast message. Please try again.');
      setTimeout(() => setError(null), 5000);
    }
  };

  const refreshConversations = async () => {
    await fetchConversations();
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role) => {
    switch (role) {
      case 'Agent': return 'text-blue-600';
      case 'Support': return 'text-green-600';
      case 'Customer': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusColor = (status) => {
    return status === 'online' ? 'bg-green-400' : 'bg-gray-400';
  };

  // Show loading screen
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading conversations...</p>
        </div>
      </div>
    );
  }

  // Show error screen if there's a critical error
  if (error && conversations.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={refreshConversations}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)]">
      {/* Broadcast Modal */}
      {showBroadcast && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Broadcast Message to All Agents</h3>
            <textarea
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              placeholder="Type your broadcast message..."
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setShowBroadcast(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleBroadcastMessage}
                disabled={!broadcastMessage.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                Broadcast
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className={`mb-4 p-3 border-l-4 ${error.includes('success')
            ? 'bg-green-100 border-green-500 text-green-700'
            : 'bg-red-100 border-red-500 text-red-700'
          }`}>
          {error}
        </div>
      )}

      <div className="flex h-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Conversations List */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowBroadcast(true)}
                  className="text-blue-600 hover:text-blue-800"
                  title="Broadcast message to all agents"
                >
                  <Radio className="h-4 w-4" />
                </button>
                <button
                  onClick={refreshConversations}
                  disabled={loading}
                  className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedChat(conversation.id)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100 ${selectedChat === conversation.id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-medium">
                        {conversation.avatar}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(conversation.status)} rounded-full border-2 border-white`}></div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-gray-900 truncate">{conversation.name}</h3>
                        <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 truncate flex-1">{conversation.lastMessage}</p>
                        {conversation.unread > 0 && (
                          <span className="ml-2 bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                            {conversation.unread}
                          </span>
                        )}
                      </div>

                      <p className={`text-xs mt-1 font-medium ${getRoleColor(conversation.role)}`}>
                        {conversation.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                {loading ? 'Loading conversations...' : 
                 conversations.length === 0 ? 'No agents found for this hub' : 
                 'No conversations match your search'}
              </div>
            )}
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
                    <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-medium">
                      {conversations.find(c => c.id === selectedChat)?.avatar}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(conversations.find(c => c.id === selectedChat)?.status)} rounded-full border-2 border-white`}></div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900">
                      {conversations.find(c => c.id === selectedChat)?.name}
                    </h3>
                    <p className={`text-sm font-medium ${getRoleColor(conversations.find(c => c.id === selectedChat)?.role)}`}>
                      {conversations.find(c => c.id === selectedChat)?.role}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {(messages[selectedChat] || []).length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <MessageCircle className="mx-auto h-8 w-8 mb-2" />
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  </div>
                ) : (
                  (messages[selectedChat] || []).map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.isOwn
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                        } ${message.isTemporary ? 'opacity-75' : ''}`}>
                        <p className="text-sm">{message.message}</p>
                        <div className={`flex items-center justify-end mt-1 space-x-1 ${message.isOwn ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                          <span className="text-xs">{message.timestamp}</span>
                          {message.isTemporary && <span className="text-xs">Sending...</span>}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Send message"
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
                <p className="text-gray-500">Choose an agent from the list to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;