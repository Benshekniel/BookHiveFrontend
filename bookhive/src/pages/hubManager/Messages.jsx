import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, Search, User, Clock, CheckCheck, RefreshCw } from 'lucide-react';
import { agentApi, deliveryApi } from '../../services/apiService';

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hubId] = useState(1); // This should come from auth context

  // Fetch conversations and messages
  useEffect(() => {
    fetchConversations();
  }, [hubId]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch agents and deliveries to create conversation threads
      const [agentsResponse, deliveriesResponse] = await Promise.all([
        agentApi.getAgentsByHub(hubId),
        deliveryApi.getDeliveriesByHub(hubId)
      ]);

      // Generate conversations based on agents and recent delivery activities
      const generatedConversations = generateConversationsFromData(agentsResponse, deliveriesResponse);
      setConversations(generatedConversations);

      // Generate messages for each conversation
      const allMessages = generateMessagesForConversations(generatedConversations, deliveriesResponse);
      setMessages(allMessages);

    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const generateConversationsFromData = (agents, deliveries) => {
    const conversations = [];

    // Add conversations with active agents
    agents.forEach((agent, index) => {
      const agentDeliveries = deliveries.filter(d => d.agentId === agent.id);
      const hasRecentActivity = agentDeliveries.some(d => 
        ['IN_TRANSIT', 'PICKED_UP', 'DELAYED'].includes(d.status)
      );

      if (hasRecentActivity || index < 3) { // Show top 3 agents + active ones
        const lastDelivery = agentDeliveries[agentDeliveries.length - 1];
        const lastMessage = generateLastMessage(agent, lastDelivery);
        
        conversations.push({
          id: agent.id,
          name: agent.name || `${agent.firstName} ${agent.lastName}`,
          role: 'Agent',
          avatar: (agent.name || `${agent.firstName} ${agent.lastName}`).split(' ').map(n => n[0]).join(''),
          lastMessage: lastMessage.text,
          timestamp: lastMessage.timestamp,
          unread: hasRecentActivity ? Math.floor(Math.random() * 3) : 0,
          status: agent.availabilityStatus === 'AVAILABLE' ? 'online' : 'offline',
          agentData: agent
        });
      }
    });

    // Add system/support conversations
    conversations.push({
      id: 'support',
      name: 'Hub Support',
      role: 'Support',
      avatar: 'HS',
      lastMessage: 'Your performance report for this week is ready for review.',
      timestamp: '1 day ago',
      unread: 0,
      status: 'online'
    });

    // Add customer service conversations for urgent deliveries
    const urgentDeliveries = deliveries.filter(d => 
      d.priority === 'URGENT' || d.status === 'DELAYED'
    );

    urgentDeliveries.slice(0, 2).forEach((delivery, index) => {
      conversations.push({
        id: `customer_${delivery.id}`,
        name: delivery.customerName || `Customer ${delivery.id}`,
        role: 'Customer',
        avatar: (delivery.customerName || `Customer ${delivery.id}`).split(' ').map(n => n[0]).join(''),
        lastMessage: generateCustomerMessage(delivery),
        timestamp: formatTimestamp(delivery.updatedAt || delivery.createdAt),
        unread: delivery.status === 'DELAYED' ? 2 : 1,
        status: 'offline',
        deliveryData: delivery
      });
    });

    return conversations.sort((a, b) => b.unread - a.unread);
  };

  const generateLastMessage = (agent, delivery) => {
    if (!delivery) {
      return {
        text: `Hi, I'm ready for new assignments today.`,
        timestamp: '2 hours ago'
      };
    }

    const messageTemplates = {
      'IN_TRANSIT': `On my way to deliver ${delivery.trackingNumber}. ETA 15 minutes.`,
      'PICKED_UP': `Package ${delivery.trackingNumber} picked up successfully.`,
      'DELIVERED': `Delivery ${delivery.trackingNumber} completed successfully.`,
      'DELAYED': `Experiencing delays with ${delivery.trackingNumber}. Need assistance.`,
      'PENDING': `Ready to pick up ${delivery.trackingNumber}.`
    };

    return {
      text: messageTemplates[delivery.status] || 'Status update on current deliveries.',
      timestamp: formatTimestamp(delivery.updatedAt || delivery.createdAt)
    };
  };

  const generateCustomerMessage = (delivery) => {
    const messageTemplates = {
      'DELAYED': `My delivery ${delivery.trackingNumber} is running late. When will it arrive?`,
      'IN_TRANSIT': `Can you provide an update on my delivery ${delivery.trackingNumber}?`,
      'PENDING': `When will my order ${delivery.trackingNumber} be picked up?`
    };

    return messageTemplates[delivery.status] || `Question about delivery ${delivery.trackingNumber}`;
  };

  const generateMessagesForConversations = (conversations, deliveries) => {
    const allMessages = {};

    conversations.forEach(conv => {
      if (conv.agentData) {
        // Generate agent conversation
        allMessages[conv.id] = generateAgentMessages(conv.agentData, deliveries);
      } else if (conv.deliveryData) {
        // Generate customer conversation
        allMessages[conv.id] = generateCustomerMessages(conv.deliveryData);
      } else if (conv.id === 'support') {
        // Generate support conversation
        allMessages[conv.id] = generateSupportMessages();
      }
    });

    return allMessages;
  };

  const generateAgentMessages = (agent, deliveries) => {
    const agentDeliveries = deliveries.filter(d => d.agentId === agent.id);
    const messages = [];

    // Initial greeting
    messages.push({
      id: 1,
      sender: agent.name || `${agent.firstName} ${agent.lastName}`,
      message: `Good morning! I'm ready for today's deliveries.`,
      timestamp: '9:00 AM',
      isOwn: false
    });

    // Add messages based on deliveries
    agentDeliveries.slice(0, 3).forEach((delivery, index) => {
      messages.push({
        id: messages.length + 1,
        sender: 'You',
        message: `Please handle delivery ${delivery.trackingNumber} to ${delivery.deliveryAddress}`,
        timestamp: `${10 + index}:00 AM`,
        isOwn: true
      });

      messages.push({
        id: messages.length + 1,
        sender: agent.name || `${agent.firstName} ${agent.lastName}`,
        message: `Received. On my way to pick up ${delivery.trackingNumber}.`,
        timestamp: `${10 + index}:15 AM`,
        isOwn: false
      });
    });

    return messages;
  };

  const generateCustomerMessages = (delivery) => {
    return [
      {
        id: 1,
        sender: delivery.customerName || `Customer ${delivery.id}`,
        message: `Hello, I have a question about my delivery ${delivery.trackingNumber}.`,
        timestamp: '2:00 PM',
        isOwn: false
      },
      {
        id: 2,
        sender: 'You',
        message: `Hi! I'd be happy to help you with your delivery. Let me check the status.`,
        timestamp: '2:05 PM',
        isOwn: true
      },
      {
        id: 3,
        sender: delivery.customerName || `Customer ${delivery.id}`,
        message: delivery.status === 'DELAYED' 
          ? `It was supposed to arrive by now. Is there an issue?`
          : `When can I expect the delivery to arrive?`,
        timestamp: '2:07 PM',
        isOwn: false
      }
    ];
  };

  const generateSupportMessages = () => {
    return [
      {
        id: 1,
        sender: 'Hub Support',
        message: 'Your weekly performance report is now available in the dashboard.',
        timestamp: '1:00 PM',
        isOwn: false
      },
      {
        id: 2,
        sender: 'You',
        message: 'Thank you! I\'ll review it shortly.',
        timestamp: '1:15 PM',
        isOwn: true
      },
      {
        id: 3,
        sender: 'Hub Support',
        message: 'Also, please note the new route optimization features available this week.',
        timestamp: '1:16 PM',
        isOwn: false
      }
    ];
  };

  const formatTimestamp = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes} min ago`;
    } else if (diffMinutes < 1440) {
      return `${Math.floor(diffMinutes / 60)} hours ago`;
    } else {
      return `${Math.floor(diffMinutes / 1440)} days ago`;
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const newResponse = {
      id: (messages[selectedChat]?.length || 0) + 1,
      sender: 'You',
      message: newMessage,
      timestamp: new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }),
      isOwn: true
    };

    setMessages(prev => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), newResponse]
    }));

    // Update last message in conversation
    setConversations(prev => 
      prev.map(conv => 
        conv.id === selectedChat 
          ? { ...conv, lastMessage: newMessage, timestamp: 'Just now', unread: 0 }
          : conv
      )
    );

    setNewMessage('');

    // Simulate response for agents (not for support/customers)
    const selectedConv = conversations.find(c => c.id === selectedChat);
    if (selectedConv?.agentData) {
      setTimeout(() => {
        const agentResponse = {
          id: (messages[selectedChat]?.length || 0) + 2,
          sender: selectedConv.name,
          message: generateAgentResponse(newMessage),
          timestamp: new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          }),
          isOwn: false
        };

        setMessages(prev => ({
          ...prev,
          [selectedChat]: [...(prev[selectedChat] || []), agentResponse]
        }));
      }, 2000);
    }
  };

  const generateAgentResponse = (userMessage) => {
    const responses = [
      "Roger that! I'll take care of it right away.",
      "Understood. I'm on my way.",
      "Thanks for the update. Everything is going smoothly.",
      "Will do! I'll keep you posted on the progress.",
      "Got it. I'll handle this priority delivery first."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
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

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
          <button 
            onClick={refreshConversations}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)]">
      <div className="flex h-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Conversations List */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-heading font-semibold text-textPrimary">Messages</h1>
              <button 
                onClick={refreshConversations}
                disabled={loading}
                className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
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
                  selectedChat === conversation.id ? 'bg-blue-50 border-blue-200' : ''
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
                      <h3 className="font-medium text-textPrimary truncate">{conversation.name}</h3>
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
            ))}

            {filteredConversations.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                No conversations found
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
                    <h3 className="font-medium text-textPrimary">
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
                {(messages[selectedChat] || []).map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.isOwn
                        ? 'bg-blue-500 text-white'
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