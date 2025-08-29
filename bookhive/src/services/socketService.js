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

        console.log('Connecting to Socket.IO server...', userId);

        this.socket = io('http://localhost:9091', {
            transports: ['polling', 'websocket'], // Try polling first, then websocket
            timeout: 20000,
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: this.maxReconnectAttempts,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            maxReconnectionAttempts: 5,
            forceNew: true
        });

        this.userId = userId;

        this.socket.on('connect', () => {
            console.log('✅ Connected to Socket.IO server');
            console.log('Socket ID:', this.socket.id);
            this.connected = true;
            this.reconnectAttempts = 0;

            // Join user room
            console.log('Joining user room for userId:', userId);
            this.socket.emit('join_user', { userId }, (response) => {
                console.log('Join user response:', response);
            });

            // Notify connection callbacks
            this.connectionCallbacks.forEach(callback => callback(true));
        });

        this.socket.on('disconnect', (reason) => {
            console.log('❌ Disconnected from Socket.IO server. Reason:', reason);
            this.connected = false;

            // Notify connection callbacks
            this.connectionCallbacks.forEach(callback => callback(false));
        });

        this.socket.on('connect_error', (error) => {
            console.error('❌ Socket.IO connection error:', error.message);
            console.error('Error details:', error);

            this.reconnectAttempts++;
            if (this.reconnectAttempts >= this.maxReconnectAttempts) {
                console.error('Max reconnection attempts reached');
            }
        });

        this.socket.on('reconnect', (attemptNumber) => {
            console.log('🔄 Reconnected to Socket.IO server after', attemptNumber, 'attempts');
            this.reconnectAttempts = 0;
        });

        this.socket.on('reconnect_error', (error) => {
            console.error('🔄❌ Reconnection error:', error.message);
        });

        this.socket.on('user_joined', (data) => {
            console.log('✅ Successfully joined user room:', data);
        });

        this.socket.on('new_message', (data) => {
            console.log('📨 New message received via socket:', data);
            this.handleNewMessage(data);
        });

        this.socket.on('message_sent', (data) => {
            console.log('✅ Message sent confirmation via socket:', data);
            this.handleMessageSent(data);
        });

        this.socket.on('unread_count_update', (data) => {
            console.log('🔢 Unread count update via socket:', data);
            this.handleUnreadCountUpdate(data);
        });

        this.socket.on('conversation_update', (data) => {
            console.log('💬 Conversation update via socket:', data);
            this.handleConversationUpdate(data);
        });

        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.connected = false;
            this.userId = null;
            console.log('Socket.IO disconnected');
        }
    }

    // FIXED: Handle incoming messages
    handleNewMessage(data) {
        console.log('=== HANDLING NEW MESSAGE ===');
        console.log('Raw data:', data);
        
        // Extract data from the socket message
        const { message, senderId, receiverId } = data;
        
        console.log('Extracted - senderId:', senderId, 'receiverId:', receiverId);
        console.log('Current user ID:', this.userId);
        
        // Process the message for all relevant callbacks
        this.messageCallbacks.forEach((callback, conversationId) => {
            console.log('Checking callback for conversation:', conversationId);
            
            // For 'all' callbacks or if this conversation involves the current user
            if (conversationId === 'all' || 
                conversationId === senderId || 
                conversationId === receiverId) {
                
                console.log('Calling callback for conversation:', conversationId);
                
                const processedMessage = {
                    type: 'new_message',
                    message: {
                        id: message.messageId || message.id,
                        messageId: message.messageId || message.id,
                        content: message.content || message.message,
                        senderName: message.senderName || message.sender,
                        receiverName: message.receiverName || message.receiver,
                        createdAt: message.createdAt || message.timestamp,
                        timestamp: message.timestamp || message.createdAt,
                        isRead: message.isRead || false,
                        senderId: senderId,
                        receiverId: receiverId
                    },
                    senderId: senderId,
                    receiverId: receiverId
                };
                
                console.log('Processed message:', processedMessage);
                callback(processedMessage);
            }
        });
        
        console.log('=== NEW MESSAGE HANDLED ===');
    }

    // FIXED: Handle sent message confirmation
    handleMessageSent(data) {
        console.log('=== HANDLING MESSAGE SENT ===');
        console.log('Raw data:', data);
        
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
                
                console.log('Processed message sent:', processedMessage);
                callback(processedMessage);
            }
        });
        
        console.log('=== MESSAGE SENT HANDLED ===');
    }

    // Handle unread count updates
    handleUnreadCountUpdate(data) {
        console.log('=== HANDLING UNREAD COUNT UPDATE ===');
        console.log('Unread count data:', data);
        
        this.unreadCountCallbacks.forEach(callback => {
            callback(data.unreadCount);
        });
        
        console.log('=== UNREAD COUNT UPDATE HANDLED ===');
    }

    // Handle conversation updates
    handleConversationUpdate(data) {
        console.log('=== HANDLING CONVERSATION UPDATE ===');
        console.log('Conversation update data:', data);
        
        this.conversationUpdateCallbacks.forEach(callback => {
            callback(data);
        });
        
        console.log('=== CONVERSATION UPDATE HANDLED ===');
    }

    // Subscribe to messages for a specific conversation
    onMessage(conversationId, callback) {
        console.log('Subscribing to messages for conversation:', conversationId);
        this.messageCallbacks.set(conversationId, callback);
        return () => {
            console.log('Unsubscribing from messages for conversation:', conversationId);
            this.messageCallbacks.delete(conversationId);
        };
    }

    // Subscribe to all messages
    onAllMessages(callback) {
        console.log('Subscribing to all messages');
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

    // Utility methods
    isConnected() {
        return this.connected && this.socket && this.socket.connected;
    }

    getCurrentUserId() {
        return this.userId;
    }

    formatTimestamp(dateString) {
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
    }

    // Force reconnection
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