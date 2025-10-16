// components/Messages/Messages.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MessageCircle, Send, Search, RefreshCw, Radio, Wifi, WifiOff } from 'lucide-react';
import { useAuth } from '../../components/AuthContext';
import messageService from '../../services/messageService';
import socketService from '../../services/socketService';

const Messages = () => {
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableContacts, setAvailableContacts] = useState([]);
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [sendingMessage, setSendingMessage] = useState(false);

  // Refs
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const processedMessageIds = useRef(new Set());

  // Auto scroll to bottom
  const scrollToBottom = () => {
    if (messagesEndRef.current && chatContainerRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  // Scroll to bottom when messages change for selected chat
  useEffect(() => {
    if (selectedChat && messages[selectedChat]) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, selectedChat]);

  // FIXED: Enhanced socket message handler with duplicate prevention
  const handleSocketMessage = useCallback((data) => {
    console.log('=== WEB SOCKET MESSAGE RECEIVED ===');
    console.log('Full socket data:', JSON.stringify(data, null, 2));
    console.log('Current user ID:', user.userId);
    console.log('Selected chat:', selectedChat);

    try {
      const { type, message, senderId, receiverId } = data;

      if (type === 'new_message') {
        console.log('Processing new_message...');
        console.log('Message senderId:', senderId, 'receiverId:', receiverId);

        // Only process messages sent TO this user, not FROM this user
        if (senderId === user.userId) {
          console.log('⏭️ Ignoring message sent by current user to prevent duplicates');
          return;
        }

        // Ensure we have the required data
        if (!senderId || !receiverId || !message) {
          console.error('❌ Missing required message data:', { senderId, receiverId, message });
          return;
        }

        // Create unique message ID for duplicate detection
        const messageId = message.id || message.messageId || `received_${Date.now()}_${Math.random()}`;
        const messageKey = `${senderId}_${receiverId}_${message.content}_${message.createdAt}`;

        // Check for duplicates
        if (processedMessageIds.current.has(messageKey)) {
          console.log('⏭️ Message already processed, skipping duplicate');
          return;
        }

        // Add to processed messages
        processedMessageIds.current.add(messageKey);

        // Clean up old processed message IDs (keep last 100)
        if (processedMessageIds.current.size > 100) {
          const idsArray = Array.from(processedMessageIds.current);
          processedMessageIds.current = new Set(idsArray.slice(-50));
        }

        console.log('📨 Processing new message from mobile...');
        console.log('Message content:', message.content);

        // For received messages, the chatPartnerId is the sender
        const chatPartnerId = senderId;
        console.log('Storing message under chatPartnerId:', chatPartnerId);

        // Create message object
        const newMessageObj = {
          id: messageId,
          sender: message.senderName || `User ${senderId}`,
          message: message.content || '',
          timestamp: formatTimestamp(message.createdAt || message.timestamp || new Date()),
          isOwn: false,
          isRead: false,
          rawTimestamp: message.createdAt || message.timestamp || new Date()
        };

        console.log('📋 New message object:', newMessageObj);

        // Update messages state
        setMessages(prev => {
          console.log('Previous messages for partner', chatPartnerId, ':', prev[chatPartnerId]?.length || 0);
          const updated = { ...prev };

          if (!updated[chatPartnerId]) {
            updated[chatPartnerId] = [];
            console.log('Created new message array for partner:', chatPartnerId);
          }

          // Double-check for duplicates in current messages
          const existingMessage = updated[chatPartnerId].find(msg => 
            msg.id === newMessageObj.id || 
            (msg.message === newMessageObj.message && 
             Math.abs(new Date(msg.rawTimestamp) - new Date(newMessageObj.rawTimestamp)) < 5000)
          );

          if (!existingMessage) {
            updated[chatPartnerId] = [...updated[chatPartnerId], newMessageObj];
            console.log('✅ Message added successfully. New array length:', updated[chatPartnerId].length);
          } else {
            console.log('⏭️ Message already exists in state, skipping');
            return prev; // Return unchanged state
          }

          return updated;
        });

        // Update conversation list
        setConversations(prev => {
          console.log('📝 Updating conversations...');
          const updated = [...prev];

          // Find existing conversation
          const existingIndex = updated.findIndex(conv => conv.id === chatPartnerId);

          const messageContent = message.content || '';
          const messageTime = message.createdAt || message.timestamp || new Date();

          if (existingIndex !== -1) {
            // Update existing conversation
            const currentUnread = updated[existingIndex].unread || 0;
            updated[existingIndex] = {
              ...updated[existingIndex],
              lastMessage: messageContent,
              timestamp: formatTimestamp(messageTime),
              unread: selectedChat === chatPartnerId ? 0 : currentUnread + 1,
              lastMessageTime: messageTime
            };
            console.log('✅ Updated existing conversation:', updated[existingIndex]);
          } else {
            // Create new conversation if it doesn't exist
            const newConv = {
              id: chatPartnerId,
              name: message.senderName || `User ${chatPartnerId}`,
              role: 'User',
              avatar: (message.senderName || `User ${chatPartnerId}`).charAt(0).toUpperCase(),
              lastMessage: messageContent,
              timestamp: formatTimestamp(messageTime),
              unread: selectedChat === chatPartnerId ? 0 : 1,
              status: 'offline',
              lastMessageTime: messageTime
            };
            updated.push(newConv);
            console.log('✅ Created new conversation:', newConv);
          }

          // Sort conversations by last message time
          updated.sort((a, b) => {
            if (!a.lastMessageTime && !b.lastMessageTime) return 0;
            if (!a.lastMessageTime) return 1;
            if (!b.lastMessageTime) return -1;
            return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
          });

          return updated;
        });

        // If current chat is open, mark immediately as read
        if (selectedChat === chatPartnerId) {
          console.log('📖 Current chat is open, marking as read immediately');
          setTimeout(() => markConversationAsRead(chatPartnerId), 100);
        } else {
          // Show notification if not in current chat
          showNotification(
            message.senderName || 'User',
            message.content || 'New message'
          );
        }

        // Refresh unread count
        setTimeout(() => fetchUnreadCount(), 100);
      }

    } catch (error) {
      console.error('❌ Error processing socket message:', error);
    }

    console.log('=== END WEB SOCKET MESSAGE PROCESSING ===');
  }, [selectedChat, user.userId]);

  // Format timestamp
  const formatTimestamp = (dateString) => {
    if (!dateString) return 'Unknown';

    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMinutes = Math.floor((now - date) / (1000 * 60));

      if (diffMinutes < 1) return 'Just now';
      if (diffMinutes < 60) return `${diffMinutes} min ago`;
      if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} hours ago`;
      return `${Math.floor(diffMinutes / 1440)} days ago`;
    } catch (error) {
      return 'Unknown';
    }
  };

  // Other callback handlers
  const handleUnreadCountUpdate = useCallback((count) => {
    console.log('📊 Unread count updated:', count);
    setUnreadCount(count);
  }, []);

  const handleConversationUpdate = useCallback((data) => {
    console.log('💬 Conversation update received:', data);
    // Handle conversation updates if needed
  }, []);

  const handleConnectionChange = useCallback((connected) => {
    console.log('🔌 Connection status changed:', connected);
    setIsConnected(connected);
    if (connected) {
      setError(null);
    } else {
      setError('Connection lost. Trying to reconnect...');
    }
  }, []);

  // Initialize socket connection
  useEffect(() => {
    if (user && user.userId) {
      console.log('🚀 Initializing socket connection for user:', user.userId);
      socketService.connect(user.userId);

      // Set up event listeners
      const unsubscribeMessage = socketService.onAllMessages(handleSocketMessage);
      const unsubscribeUnreadCount = socketService.onUnreadCountUpdate(handleUnreadCountUpdate);
      const unsubscribeConversationUpdate = socketService.onConversationUpdate(handleConversationUpdate);
      const unsubscribeConnection = socketService.onConnectionChange(handleConnectionChange);

      return () => {
        unsubscribeMessage();
        unsubscribeUnreadCount();
        unsubscribeConversationUpdate();
        unsubscribeConnection();
      };
    }

    return () => {
      socketService.disconnect();
    };
  }, [user, handleSocketMessage, handleUnreadCountUpdate, handleConversationUpdate, handleConnectionChange]);

  // Initial data load
  useEffect(() => {
    if (user && user.userId) {
      loadAllData();
    }
  }, [user]);

  // Role-based contact mapping
  const getRoleBasedContacts = (userRole) => {
    const roleContactMap = {
      'admin': ['moderator', 'manager', 'organization', 'hubmanager'],
      'moderator': ['admin', 'user', 'agent', 'bookstore'],
      'bookstore': ['user', 'moderator', 'manager'],
      'manager': ['agent', 'hubmanager', 'admin', 'moderator'],
      'agent': ['manager', 'hubmanager'],
      'hubmanager': ['agent', 'manager', 'admin'],
      'organization': ['admin', 'moderator'],
      'user': ['moderator', 'bookstore']
    };
    return roleContactMap[userRole.toLowerCase()] || [];
  };

  const canBroadcast = (userRole) => {
    return ['admin', 'manager', 'hubmanager', 'moderator'].includes(userRole.toLowerCase());
  };

  // Data loading functions
  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      await fetchAvailableContacts();
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load messaging data');
      setLoading(false);
    }
  };

  const fetchAvailableContacts = async () => {
    try {
      console.log('📋 Fetching contacts for role:', user.role);

      const allowedRoles = getRoleBasedContacts(user.role.toLowerCase());
      console.log('Allowed contact roles:', allowedRoles);

      const contacts = await messageService.getAvailableContactsByRole(user.role, user.userId);
      const filteredContacts = contacts.filter(contact =>
        allowedRoles.includes(contact.role.toLowerCase())
      );

      setAvailableContacts(filteredContacts);
      console.log('Available contacts:', filteredContacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setError('Failed to load available contacts');
      throw error;
    }
  };

  // Load conversations when contacts change
  useEffect(() => {
    if (availableContacts.length > 0) {
      fetchConversations();
    }
  }, [availableContacts]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('📥 Fetching conversations for user:', user.userId);

      const userMessages = await messageService.getUserMessages(user.userId);
      console.log('User messages:', userMessages);

      const conversationMap = new Map();

      userMessages.forEach(message => {
        const partnerId = message.senderId === user.userId ? message.receiverId : message.senderId;
        const partnerName = message.senderId === user.userId ? message.receiverName : message.senderName;

        if (!conversationMap.has(partnerId)) {
          conversationMap.set(partnerId, {
            id: partnerId,
            name: partnerName,
            role: 'User',
            avatar: partnerName ? partnerName.charAt(0).toUpperCase() : 'U',
            lastMessage: message.content,
            timestamp: formatTimestamp(message.createdAt),
            unread: 0,
            status: 'offline',
            lastMessageTime: message.createdAt
          });
        }

        const conversation = conversationMap.get(partnerId);
        if (new Date(message.createdAt) > new Date(conversation.lastMessageTime || 0)) {
          conversation.lastMessage = message.content;
          conversation.timestamp = formatTimestamp(message.createdAt);
          conversation.lastMessageTime = message.createdAt;
        }

        if (message.receiverId === user.userId && !message.Read) {
          conversation.unread++;
        }
      });

      availableContacts.forEach(contact => {
        if (!conversationMap.has(contact.user_id)) {
          conversationMap.set(contact.user_id, {
            id: contact.user_id,
            name: contact.name,
            role: contact.role,
            avatar: contact.name.charAt(0).toUpperCase(),
            lastMessage: 'No messages yet',
            timestamp: 'Never',
            unread: 0,
            status: 'offline',
            lastMessageTime: null
          });
        } else {
          const conversation = conversationMap.get(contact.user_id);
          conversation.role = contact.role;
        }
      });

      const conversationsArray = Array.from(conversationMap.values())
        .sort((a, b) => {
          if (!a.lastMessageTime && !b.lastMessageTime) return 0;
          if (!a.lastMessageTime) return 1;
          if (!b.lastMessageTime) return -1;
          return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
        });

      setConversations(conversationsArray);
      console.log('Processed conversations:', conversationsArray);

      await loadConversationMessages(conversationsArray, user.userId);

    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const loadConversationMessages = async (conversations, userId) => {
    const allMessages = {};

    for (const conv of conversations) {
      try {
        const conversationMessages = await messageService.getConversation(userId, conv.id);

        allMessages[conv.id] = conversationMessages.map(msg => ({
          id: msg.messageId,
          sender: msg.senderId === userId ? 'You' : msg.senderName,
          message: msg.content,
          timestamp: formatTimestamp(msg.createdAt),
          isOwn: msg.senderId === userId,
          isRead: msg.Read
        }));
      } catch (error) {
        console.error(`Error loading messages for user ${conv.id}:`, error);
        allMessages[conv.id] = [];
      }
    }

    setMessages(allMessages);
    console.log('All messages loaded:', allMessages);
  };

  // Fetch initial unread count
  useEffect(() => {
    if (user && user.userId) {
      fetchUnreadCount();
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      const count = await messageService.getUnreadMessageCount(user.userId);
      console.log('Fetched unread count:', count);
      setUnreadCount(count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  // Notification
  const showNotification = (sender, message) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`New message from ${sender}`, {
        body: message,
        icon: '/favicon.ico'
      });
    }
  };

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || sendingMessage) return;

    const messageContent = newMessage.trim();
    setSendingMessage(true);
    setNewMessage('');

    // Add message immediately as sent
    const immediateMessage = {
      id: `sent_${Date.now()}_${Math.random()}`,
      sender: 'You',
      message: messageContent,
      timestamp: formatTimestamp(new Date()),
      isOwn: true,
      isRead: true
    };

    setMessages(prev => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), immediateMessage]
    }));

    // Update conversation list immediately
    setConversations(prev => {
      const updated = [...prev];
      const existingIndex = updated.findIndex(conv => conv.id === selectedChat);

      if (existingIndex !== -1) {
        updated[existingIndex] = {
          ...updated[existingIndex],
          lastMessage: messageContent,
          timestamp: formatTimestamp(new Date()),
          lastMessageTime: new Date()
        };
      }

      // Sort conversations
      updated.sort((a, b) => {
        if (!a.lastMessageTime && !b.lastMessageTime) return 0;
        if (!a.lastMessageTime) return 1;
        if (!b.lastMessageTime) return -1;
        return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
      });

      return updated;
    });

    try {
      await messageService.sendMessage({
        senderId: user.userId,
        receiverId: selectedChat,
        content: messageContent
      });
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
      setTimeout(() => setError(null), 5000);
    } finally {
      setSendingMessage(false);
    }
  };

  // Mark conversation as read
  const markConversationAsRead = async (conversationId) => {
    try {
      console.log(`📖 Marking conversation ${conversationId} as read for user ${user.userId}`);

      await messageService.markConversationAsRead(user.userId, conversationId);

      // Update local state immediately
      setConversations(prev => prev.map(conv =>
        conv.id === conversationId ? { ...conv, unread: 0 } : conv
      ));

      // Update messages state to mark all as read
      setMessages(prev => ({
        ...prev,
        [conversationId]: (prev[conversationId] || []).map(msg => ({
          ...msg,
          isRead: true
        }))
      }));

      // Refresh unread count from DB
      await fetchUnreadCount();

      console.log(`✅ Conversation ${conversationId} marked as read`);
    } catch (error) {
      console.error('Error marking conversation as read:', error);
    }
  };

  // Select chat and mark as read
  const handleSelectChat = async (chatId) => {
    console.log('Selecting chat:', chatId);
    setSelectedChat(chatId);

    // Mark conversation as read immediately
    const conversation = conversations.find(c => c.id === chatId);
    if (conversation && conversation.unread > 0) {
      await markConversationAsRead(chatId);
    }
  };

  // Broadcast message
  const handleBroadcastMessage = async () => {
    if (!broadcastMessage.trim()) return;

    try {
      const broadcastPromises = availableContacts.map(contact =>
        messageService.sendMessage({
          senderId: user.userId,
          receiverId: contact.user_id,
          content: `[Broadcast] ${broadcastMessage}`
        })
      );

      await Promise.all(broadcastPromises);

      setBroadcastMessage('');
      setShowBroadcast(false);
      setError('Message broadcasted successfully!');
      setTimeout(() => setError(null), 3000);

    } catch (error) {
      console.error('Error broadcasting message:', error);
      setError('Failed to broadcast message. Please try again.');
      setTimeout(() => setError(null), 5000);
    }
  };

  // Refresh conversations
  const refreshConversations = async () => {
    await loadAllData();
  };

  // Utility functions
  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role) => {
    const roleColors = {
      'admin': 'text-red-600',
      'moderator': 'text-blue-600',
      'bookstore': 'text-green-600',
      'manager': 'text-purple-600',
      'agent': 'text-orange-600',
      'hubmanager': 'text-indigo-600',
      'organization': 'text-pink-600',
      'user': 'text-gray-600'
    };
    return roleColors[role.toLowerCase()] || 'text-gray-600';
  };

  const getStatusColor = (status) => {
    return status === 'online' ? 'bg-green-400' : 'bg-gray-400';
  };

  // Redirect to login if not authenticated
  if (!user) {
    window.location.href = "http://localhost:9999/login";
    return null;
  }

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

  return (
    <div className="h-[calc(100vh-8rem)] overflow-hidden">
      {/* Broadcast Modal */}
      {showBroadcast && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Broadcast Message</h3>
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
        <div className="w-1/3 border-r border-gray-200 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex space-x-2">
                <div className="flex items-center">
                  {isConnected ? (
                    <Wifi className="h-4 w-4 text-green-500" title="Connected" />
                  ) : (
                    <WifiOff className="h-4 w-4 text-red-500" title="Disconnected" />
                  )}
                </div>
                {canBroadcast(user.role) && (
                  <button
                    onClick={() => setShowBroadcast(true)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Broadcast message"
                  >
                    <Radio className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={refreshConversations}
                  disabled={loading}
                  className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => handleSelectChat(conversation.id)}
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
                {conversations.length === 0 ? 'No conversations available' : 'No conversations match your search'}
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
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

              {/* Messages Container */}
              <div
                ref={chatContainerRef}
                className="flex-1 p-4 space-y-4 overflow-y-auto"
              >
                {(messages[selectedChat] || []).length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <MessageCircle className="mx-auto h-8 w-8 mb-2" />
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {(messages[selectedChat] || []).map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.isOwn
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                          }`}>
                          <p className="text-sm">{message.message}</p>
                          <div className={`flex items-center justify-end mt-1 space-x-1 ${message.isOwn ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                            <span className="text-xs">{message.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {/* Scroll anchor */}
                    <div ref={messagesEndRef} />
                  </>
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
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={!isConnected || sendingMessage}
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || !isConnected || sendingMessage}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                <p className="text-gray-500">Choose a contact from the list to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;