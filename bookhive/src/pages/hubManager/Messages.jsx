import { useState } from 'react';
import {
  Search,
  Send,
  Paperclip,
  MoreVertical,
  User,
  Clock,
  CheckCheck,
  AlertCircle
} from 'lucide-react';

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(1);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const conversations = [
    {
      id: 1,
      name: 'John Doe',
      role: 'Rider',
      lastMessage: 'Delivery completed successfully',
      timestamp: '2 min ago',
      unread: 0,
      online: true,
      avatar: 'JD'
    },
    {
      id: 2,
      name: 'Jane Smith',
      role: 'Rider',
      lastMessage: 'Running 10 minutes late due to traffic',
      timestamp: '15 min ago',
      unread: 2,
      online: true,
      avatar: 'JS'
    },
    {
      id: 3,
      name: 'Customer Support',
      role: 'System',
      lastMessage: 'New support ticket #1234 assigned',
      timestamp: '1 hour ago',
      unread: 1,
      online: false,
      avatar: 'CS'
    },
    {
      id: 4,
      name: 'Mike Johnson',
      role: 'Rider',
      lastMessage: 'Need assistance with delivery address',
      timestamp: '2 hours ago',
      unread: 0,
      online: false,
      avatar: 'MJ'
    },
    {
      id: 5,
      name: 'Management',
      role: 'System',
      lastMessage: 'Weekly performance report available',
      timestamp: '1 day ago',
      unread: 0,
      online: false,
      avatar: 'MG'
    }
  ];

  const messages = {
    1: [
      {
        id: 1,
        sender: 'John Doe',
        content: 'Good morning! Starting my route now.',
        timestamp: '9:00 AM',
        isOwn: false,
        status: 'read'
      },
      {
        id: 2,
        sender: 'You',
        content: 'Great! Have a safe day. Let me know if you need anything.',
        timestamp: '9:02 AM',
        isOwn: true,
        status: 'read'
      },
      {
        id: 3,
        sender: 'John Doe',
        content: 'Delivery completed successfully',
        timestamp: '2 min ago',
        isOwn: false,
        status: 'delivered'
      }
    ],
    2: [
      {
        id: 1,
        sender: 'Jane Smith',
        content: 'Hi, I\'m experiencing heavy traffic on Route B',
        timestamp: '30 min ago',
        isOwn: false,
        status: 'read'
      },
      {
        id: 2,
        sender: 'Jane Smith',
        content: 'Running 10 minutes late due to traffic',
        timestamp: '15 min ago',
        isOwn: false,
        status: 'delivered'
      }
    ]
  };

  const currentMessages = messages[selectedChat] || [];
  const currentConversation = conversations.find(c => c.id === selectedChat);

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Add message logic here
      setNewMessage('');
    }
  };

  return (
    <div className="space-y-6 p-2 bg-gray-50 min-h-screen">
      <div className="h-[calc(100vh-8rem)] flex bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Conversations List */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-slate-900 mb-4" style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}>Messages</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedChat(conversation.id)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${selectedChat === conversation.id ? 'bg-gray-50 border-l-4 border-l-blue-500' : ''
                  }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                      <span className="text-blue-900 font-semibold text-sm">{conversation.avatar}</span>
                    </div>
                    {conversation.online && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-slate-900 truncate">{conversation.name}</h3>
                      <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                      {conversation.unread > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">{conversation.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {currentConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                      <span className="text-blue-900 font-semibold">{currentConversation.avatar}</span>
                    </div>
                    {currentConversation.online && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <h2 className="font-semibold text-slate-900">{currentConversation.name}</h2>
                    <p className="text-sm text-gray-600">
                      {currentConversation.online ? 'Online' : 'Offline'} • {currentConversation.role}
                    </p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {currentMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.isOwn
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-50 text-slate-900'
                      }`}>
                      <p className="text-sm">{message.content}</p>
                      <div className={`flex items-center justify-between mt-1 ${message.isOwn ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                        <span className="text-xs">{message.timestamp}</span>
                        {message.isOwn && (
                          <CheckCheck className="w-3 h-3 ml-2" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <button className="text-gray-400 hover:text-gray-600">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600">Select a conversation</h3>
                <p className="text-gray-500">Choose a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;