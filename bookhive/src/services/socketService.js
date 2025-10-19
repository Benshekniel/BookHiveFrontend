// services/socketService.js
import io from 'socket.io-client';

class SocketService {
    constructor() {
        this.socket = null;
        this.connected = false;
        this.userId = null;
        this.messageCallbacks = new Map();
        this.connectionCallbacks = [];
        this.unreadCountCallbacks = [];
        this.conversationUpdateCallbacks = [];
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
    }

    connect(userId) {
        if (this.socket && this.connected) {
            this.disconnect();
        }

        console.log('🔌 Connecting to Socket.IO server for user:', userId);

        this.socket = io('http://localhost:9091', {
            transports: ['polling', 'websocket'],
            timeout: 20000,
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: this.maxReconnectAttempts,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            maxReconnectionAttempts: 5,
            forceNew: true,
            query: {
                userId: userId
            }
        });

        this.userId = parseInt(userId);

        this.socket.on('connect', () => {
            console.log('✅ Connected to Socket.IO server');
            console.log('Socket ID:', this.socket.id);
            this.connected = true;
            this.reconnectAttempts = 0;

            // Join user room
            console.log('Joining user room for userId:', userId);
            this.socket.emit('join_user', { userId: parseInt(userId) }, (response) => {
                console.log('Join user response:', response);
            });

            // Notify connection callbacks
            this.connectionCallbacks.forEach(callback => callback(true));
        });

        this.socket.on('disconnect', (reason) => {
            console.log('❌ Disconnected from Socket.IO server. Reason:', reason);
            this.connected = false;
            this.connectionCallbacks.forEach(callback => callback(false));
        });

        this.socket.on('connect_error', (error) => {
            console.error('❌ Socket.IO connection error:', error.message);
            this.reconnectAttempts++;
            if (this.reconnectAttempts >= this.maxReconnectAttempts) {
                console.error('Max reconnection attempts reached');
            }
        });

        this.socket.on('reconnect', (attemptNumber) => {
            console.log('🔄 Reconnected to Socket.IO server after', attemptNumber, 'attempts');
            this.reconnectAttempts = 0;
        });

        // FIXED: Listen for all possible message events
        this.socket.on('new_message', (data) => {
            console.log('📨 [new_message] Received via socket:', data);
            this.handleIncomingMessage('new_message', data);
        });

        this.socket.on('message_received', (data) => {
            console.log('📨 [message_received] Received via socket:', data);
            this.handleIncomingMessage('message_received', data);
        });

        this.socket.on('message_sent', (data) => {
            console.log('✅ [message_sent] Confirmation via socket:', data);
            this.handleMessageSent(data);
        });

        this.socket.on('unread_count_update', (data) => {
            console.log('🔢 [unread_count_update] via socket:', data);
            this.handleUnreadCountUpdate(data);
        });

        this.socket.on('conversation_update', (data) => {
            console.log('💬 [conversation_update] via socket:', data);
            this.handleConversationUpdate(data);
        });

        return this.socket;
    }

    // FIXED: Enhanced message handling with better data extraction
    handleIncomingMessage(eventType, data) {
        console.log(`=== HANDLING ${eventType.toUpperCase()} ===`);
        console.log('Raw data received:', JSON.stringify(data, null, 2));
        console.log('Current user ID:', this.userId);

        try {
            // Extract message data - handle multiple possible structures
            let messageData, senderId, receiverId, senderName;

            if (data.message) {
                // Structure: { message: {...}, senderId, receiverId }
                messageData = data.message;
                senderId = parseInt(data.senderId || data.sender_id || messageData.senderId || messageData.sender_id);
                receiverId = parseInt(data.receiverId || data.receiver_id || messageData.receiverId || messageData.receiver_id);
                senderName = data.senderName || data.sender_name || messageData.senderName || messageData.sender_name;
            } else {
                // Direct structure: { content, senderId, receiverId, ... }
                messageData = data;
                senderId = parseInt(data.senderId || data.sender_id);
                receiverId = parseInt(data.receiverId || data.receiver_id);
                senderName = data.senderName || data.sender_name;
            }

            console.log('Extracted data:');
            console.log('- senderId:', senderId);
            console.log('- receiverId:', receiverId);
            console.log('- senderName:', senderName);
            console.log('- messageData:', messageData);

            // Skip if this is a message sent by the current user (to prevent duplicates)
            if (senderId === this.userId) {
                console.log('⏭️ Skipping message sent by current user to prevent duplicates');
                return;
            }

            // Validate required fields
            if (!senderId || !receiverId || !messageData) {
                console.error('❌ Missing required message fields');
                return;
            }

            // Create standardized message object
            const standardizedMessage = {
                type: 'new_message',
                senderId: senderId,
                receiverId: receiverId,
                message: {
                    id: messageData.messageId || messageData.message_id || messageData.id || `msg_${Date.now()}`,
                    messageId: messageData.messageId || messageData.message_id || messageData.id,
                    content: messageData.content || messageData.message || messageData.text || '',
                    senderName: senderName || `User ${senderId}`,
                    receiverName: data.receiverName || data.receiver_name || `User ${receiverId}`,
                    createdAt: messageData.createdAt || messageData.created_at || messageData.timestamp || new Date().toISOString(),
                    timestamp: messageData.timestamp || messageData.createdAt || messageData.created_at || new Date().toISOString(),
                    isRead: false,
                    senderId: senderId,
                    receiverId: receiverId
                }
            };

            console.log('📋 Standardized message:', standardizedMessage);

            // Call all registered callbacks
            let callbacksCalled = 0;
            this.messageCallbacks.forEach((callback, conversationId) => {
                console.log(`🔍 Checking callback for conversation: ${conversationId}`);

                // Call callback if it's for 'all' messages or involves current user
                if (conversationId === 'all' ||
                    conversationId === senderId ||
                    conversationId === receiverId ||
                    conversationId === this.userId) {

                    console.log(`📞 Calling callback for conversation: ${conversationId}`);
                    try {
                        callback(standardizedMessage);
                        callbacksCalled++;
                    } catch (error) {
                        console.error('❌ Error in message callback:', error);
                    }
                }
            });

            console.log(`✅ Called ${callbacksCalled} message callbacks`);

        } catch (error) {
            console.error('❌ Error handling incoming message:', error);
        }

        console.log(`=== ${eventType.toUpperCase()} HANDLED ===`);
    }

    handleMessageSent(data) {
        console.log('=== HANDLING MESSAGE SENT ===');
        console.log('Raw data:', data);

        try {
            const { message, senderId, receiverId } = data;

            this.messageCallbacks.forEach((callback, conversationId) => {
                if (conversationId === 'all' ||
                    conversationId === receiverId ||
                    conversationId === senderId) {

                    const processedMessage = {
                        type: 'message_sent',
                        message: {
                            id: message.messageId || message.id,
                            messageId: message.messageId || message.id,
                            content: message.content || message.message,
                            createdAt: message.createdAt || message.timestamp,
                            timestamp: message.timestamp || message.createdAt,
                            isRead: true,
                            senderId: senderId,
                            receiverId: receiverId
                        },
                        senderId: senderId,
                        receiverId: receiverId
                    };

                    callback(processedMessage);
                }
            });
        } catch (error) {
            console.error('❌ Error handling message sent:', error);
        }

        console.log('=== MESSAGE SENT HANDLED ===');
    }

    handleUnreadCountUpdate(data) {
        console.log('=== HANDLING UNREAD COUNT UPDATE ===');
        console.log('Unread count data:', data);

        const count = data.unreadCount || data.count || 0;
        this.unreadCountCallbacks.forEach(callback => {
            try {
                callback(count);
            } catch (error) {
                console.error('❌ Error in unread count callback:', error);
            }
        });

        console.log('=== UNREAD COUNT UPDATE HANDLED ===');
    }

    handleConversationUpdate(data) {
        console.log('=== HANDLING CONVERSATION UPDATE ===');
        console.log('Conversation update data:', data);

        this.conversationUpdateCallbacks.forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error('❌ Error in conversation update callback:', error);
            }
        });

        console.log('=== CONVERSATION UPDATE HANDLED ===');
    }

    // Send message via socket
    sendMessage(messageData) {
        if (this.socket && this.connected) {
            console.log('📤 Sending message via Socket.IO:', messageData);
            this.socket.emit('send_message', {
                senderId: parseInt(messageData.senderId),
                receiverId: parseInt(messageData.receiverId),
                content: messageData.content,
                timestamp: new Date().toISOString()
            });
        } else {
            console.error('❌ Cannot send message - socket not connected');
        }
    }

    // Subscribe to messages for a specific conversation
    onMessage(conversationId, callback) {
        console.log('📝 Subscribing to messages for conversation:', conversationId);
        this.messageCallbacks.set(conversationId, callback);
        return () => {
            console.log('📝 Unsubscribing from messages for conversation:', conversationId);
            this.messageCallbacks.delete(conversationId);
        };
    }

    // services/socketService.js
    // ... (keep existing code until _setupEventListeners)

    _setupEventListeners() {
        if (_socket == null) return;

        console.log('🎧 Setting up Socket.IO event listeners');

        // FIXED: Listen for ALL possible message events from mobile
        _socket.on('new_message', (data) => {
            console.log('📨 [new_message] Received via socket:', data);
            this.handleIncomingMessage('new_message', data);
        });

        _socket.on('message_received', (data) => {
            console.log('📨 [message_received] Received via socket:', data);
            this.handleIncomingMessage('message_received', data);
        });

        // NEW: Listen for mobile-specific events
        _socket.on('mobile_message', (data) => {
            console.log('📨 [mobile_message] Received via socket:', data);
            this.handleIncomingMessage('mobile_message', data);
        });

        _socket.on('broadcast_message', (data) => {
            console.log('📨 [broadcast_message] Received via socket:', data);
            this.handleIncomingMessage('broadcast_message', data);
        });

        // NEW: Listen for send_message events (what mobile emits)
        _socket.on('send_message', (data) => {
            console.log('📨 [send_message] Received via socket:', data);
            // Only process if this is a message TO this user, not FROM this user
            if (data.receiverId === this.userId && data.senderId !== this.userId) {
                this.handleIncomingMessage('send_message', data);
            }
        });

        _socket.on('message_sent', (data) => {
            console.log('✅ [message_sent] Confirmation via socket:', data);
            this.handleMessageSent(data);
        });

        _socket.on('unread_count_update', (data) => {
            console.log('🔢 [unread_count_update] via socket:', data);
            this.handleUnreadCountUpdate(data);
        });

        _socket.on('conversation_update', (data) => {
            console.log('💬 [conversation_update] via socket:', data);
            this.handleConversationUpdate(data);
        });

        // Add debugging for all events
        _socket.onAny((eventName, ...args) => {
            console.log(`🔍 [${eventName}] Raw event received:`, args);
        });

        console.log('✅ Socket.IO event listeners set up successfully');
    }

    // ... (rest of existing code)

    // Subscribe to all messages
    onAllMessages(callback) {
        console.log('📝 Subscribing to ALL messages');
        return this.onMessage('all', callback);
    }

    // Subscribe to connection status
    onConnectionChange(callback) {
        this.connectionCallbacks.push(callback);
        return () => {
            const index = this.connectionCallbacks.indexOf(callback);
            if (index > -1) {
                this.connectionCallbacks.splice(index, 1);
            }
        };
    }

    // Subscribe to unread count updates
    onUnreadCountUpdate(callback) {
        this.unreadCountCallbacks.push(callback);
        return () => {
            const index = this.unreadCountCallbacks.indexOf(callback);
            if (index > -1) {
                this.unreadCountCallbacks.splice(index, 1);
            }
        };
    }

    // Subscribe to conversation updates
    onConversationUpdate(callback) {
        this.conversationUpdateCallbacks.push(callback);
        return () => {
            const index = this.conversationUpdateCallbacks.indexOf(callback);
            if (index > -1) {
                this.conversationUpdateCallbacks.splice(index, 1);
            }
        };
    }

    disconnect() {
        console.log('🔌 Disconnecting Socket.IO...');
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.connected = false;
            this.userId = null;
        }

        // Clear all callbacks
        this.messageCallbacks.clear();
        this.connectionCallbacks = [];
        this.unreadCountCallbacks = [];
        this.conversationUpdateCallbacks = [];
    }

    // Utility methods
    isConnected() {
        return this.connected && this.socket && this.socket.connected;
    }

    getCurrentUserId() {
        return this.userId;
    }

    forceReconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket.connect();
        }
    }
}

// Create singleton instance
const socketService = new SocketService();
export default socketService;