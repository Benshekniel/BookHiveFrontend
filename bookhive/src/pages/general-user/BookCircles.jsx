import React, { useState, useEffect, useRef, useMemo } from "react";
import { 
  Users, 
  BookOpen, 
  Search, 
  Plus, 
  MessageCircle, 
  X, 
  Send, 
  Heart, 
  Settings,
  Crown,
  Clock,
  TrendingUp,
  Filter,
  ChevronDown,
  Star,
  AlertCircle,
  CheckCircle,
  UserPlus,
  UserMinus,
  Volume2,
  VolumeX,
  MoreVertical,
  Flag,
  Shield
} from "lucide-react";
import Button from "../../components/shared/Button";

// Enhanced mock data with more realistic structure
const mockData = {
  currentUser: {
    id: 1,
    name: "Samantha Perera",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    joinedCircles: [2], // IDs of circles the user has joined
    createdCircles: [], // IDs of circles the user created
    memberSince: "2023-01-15",
    trustScore: 4.8
  },
  bookCircles: [
    {
      id: 1,
      name: "Fantasy Readers United",
      description: "Dive into magical worlds and epic adventures. Currently reading: The Name of the Wind by Patrick Rothfuss",
      category: "Fantasy",
      members: 1247,
      maxMembers: 2000,
      createdBy: {
        id: 10,
        name: "John Doe",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      },
      isActive: true,
      activeNow: 89,
      messagesCount: 342,
      todayMessages: 23,
      currentBook: {
        title: "The Name of the Wind",
        author: "Patrick Rothfuss",
        progress: 65
      },
      rules: ["Be respectful", "No spoilers without warnings", "Stay on topic"],
      isPrivate: false,
      createdAt: "2023-03-15",
      lastActivity: "2 minutes ago",
      tags: ["fantasy", "epic", "magic", "adventure"],
      rating: 4.6,
      weeklyGoal: "Read 100 pages",
      weeklyProgress: 78,
      notifications: true,
      moderators: [10, 15, 23],
      pinnedMessage: {
        id: 999,
        text: "Welcome to Fantasy Readers United! Please read our rules before participating.",
        author: "John Doe",
        timestamp: "2025-01-01"
      }
    },
    {
      id: 2,
      name: "Romance Book Club",
      description: "Love stories that make your heart flutter. Book of the month: Beach Read by Emily Henry",
      category: "Romance",
      members: 892,
      maxMembers: 1500,
      createdBy: {
        id: 11,
        name: "Emily Carter",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
      },
      isActive: true,
      activeNow: 34,
      messagesCount: 156,
      todayMessages: 12,
      currentBook: {
        title: "Beach Read",
        author: "Emily Henry",
        progress: 45
      },
      rules: ["Keep discussions respectful", "Use spoiler tags", "Be inclusive"],
      isPrivate: false,
      createdAt: "2023-02-20",
      lastActivity: "5 minutes ago",
      tags: ["romance", "contemporary", "book-club"],
      rating: 4.8,
      weeklyGoal: "Finish current book",
      weeklyProgress: 45,
      notifications: true,
      moderators: [11, 20],
      messages: [
        {
          id: 1,
          userId: 3,
          text: "Just finished Beach Read! The enemies-to-lovers trope was perfectly executed 💕",
          timestamp: "2:34 PM",
          user: "Sarah M.",
          avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face",
          likes: 5,
          replies: 2
        },
        {
          id: 2,
          userId: 4,
          text: "Agreed! Emily Henry really knows how to write chemistry between characters",
          timestamp: "2:36 PM",
          user: "Mike R.",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
          likes: 3,
          replies: 0
        },
        {
          id: 3,
          userId: 1,
          text: "What should we read next month? I'm thinking something by Christina Lauren",
          timestamp: "2:38 PM",
          user: "You",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
          likes: 8,
          replies: 4
        },
      ]
    },
    {
      id: 3,
      name: "Mystery & Thriller Enthusiasts",
      description: "Unravel mysteries and get your adrenaline pumping. Currently discussing: The Silent Patient by Alex Michaelides",
      category: "Mystery",
      members: 567,
      maxMembers: 1000,
      createdBy: {
        id: 12,
        name: "Michael Lee",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      },
      isActive: true,
      activeNow: 23,
      messagesCount: 89,
      todayMessages: 7,
      currentBook: {
        title: "The Silent Patient",
        author: "Alex Michaelides",
        progress: 30
      },
      rules: ["No major spoilers", "Use content warnings", "Respect different opinions"],
      isPrivate: false,
      createdAt: "2023-04-10",
      lastActivity: "1 hour ago",
      tags: ["mystery", "thriller", "suspense"],
      rating: 4.4,
      weeklyGoal: "Discuss plot theories",
      weeklyProgress: 30,
      notifications: false,
      moderators: [12],
      messages: []
    },
    {
      id: 4,
      name: "Classic Literature Society",
      description: "Exploring timeless works of literature. Currently reading: Pride and Prejudice by Jane Austen",
      category: "Classic",
      members: 234,
      maxMembers: 500,
      createdBy: {
        id: 13,
        name: "Professor Smith",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=40&h=40&fit=crop&crop=face",
      },
      isActive: false,
      activeNow: 3,
      messagesCount: 45,
      todayMessages: 2,
      currentBook: {
        title: "Pride and Prejudice",
        author: "Jane Austen",
        progress: 85
      },
      rules: ["Academic discussions welcome", "Cite sources", "Be patient with beginners"],
      isPrivate: true,
      createdAt: "2023-05-05",
      lastActivity: "2 days ago",
      tags: ["classic", "literature", "academic"],
      rating: 4.2,
      weeklyGoal: "Analyze themes",
      weeklyProgress: 85,
      notifications: false,
      moderators: [13],
      messages: []
    }
  ],
  genres: ["All Genres", "Fantasy", "Romance", "Mystery", "Classic", "Sci-Fi", "Non-Fiction", "Biography"]
};

const BookCircle = () => {
  // State management
  const [selectedCircle, setSelectedCircle] = useState(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All Genres");
  const [selectedActivity, setSelectedActivity] = useState("All Activities");
  const [sortBy, setSortBy] = useState("members");
  const [showFilters, setShowFilters] = useState(false);
  
  // Form states
  const [joinForm, setJoinForm] = useState({ interest: "", agreeToRules: false });
  const [createForm, setCreateForm] = useState({
    name: "",
    description: "",
    category: "Fantasy",
    isPrivate: false,
    maxMembers: 1000,
    rules: "",
    weeklyGoal: ""
  });
  
  // Chat states
  const [showChat, setShowChat] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [activeChatCircle, setActiveChatCircle] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  
  // UI states
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  
  // Refs
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize chat if user has joined circles
  useEffect(() => {
    const joinedCircles = mockData.bookCircles.filter(circle => 
      mockData.currentUser.joinedCircles.includes(circle.id)
    );
    
    if (joinedCircles.length > 0) {
      const mostActiveCircle = joinedCircles.reduce((prev, current) => 
        prev.activeNow > current.activeNow ? prev : current
      );
      setActiveChatCircle(mostActiveCircle);
      setMessages(mostActiveCircle.messages || []);
    }
  }, []);

  // Memoized filtered and sorted circles
  const filteredCircles = useMemo(() => {
    let filtered = mockData.bookCircles.filter((circle) => {
      const matchesSearch = circle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          circle.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          circle.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesGenre = selectedGenre === "All Genres" || circle.category === selectedGenre;
      
      const matchesActivity = selectedActivity === "All Activities" || 
                            (selectedActivity === "Active" && circle.isActive) ||
                            (selectedActivity === "Recent" && circle.todayMessages > 0);
      
      return matchesSearch && matchesGenre && matchesActivity;
    });

    // Sort circles
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "members":
          return b.members - a.members;
        case "activity":
          return b.activeNow - a.activeNow;
        case "rating":
          return b.rating - a.rating;
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, selectedGenre, selectedActivity, sortBy]);

  // Utility functions
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const isUserJoined = (circleId) => {
    return mockData.currentUser.joinedCircles.includes(circleId);
  };

  const isUserModerator = (circle) => {
    return circle.moderators.includes(mockData.currentUser.id);
  };

  const formatTimeAgo = (timestamp) => {
    // Simple time formatting - in real app, use a library like date-fns
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now - time;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return `${Math.floor(minutes / 1440)}d ago`;
  };

  // Form handlers
  const handleJoinChange = (field, value) => {
    setJoinForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleCreateChange = (field, value) => {
    setCreateForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateJoinForm = () => {
    const newErrors = {};
    if (!joinForm.interest.trim()) {
      newErrors.interest = "Please tell us why you're interested";
    }
    if (!joinForm.agreeToRules) {
      newErrors.agreeToRules = "You must agree to the circle rules";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateCreateForm = () => {
    const newErrors = {};
    if (!createForm.name.trim()) {
      newErrors.name = "Circle name is required";
    }
    if (!createForm.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (createForm.maxMembers < 10 || createForm.maxMembers > 10000) {
      newErrors.maxMembers = "Max members should be between 10 and 10,000";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Action handlers
  const handleJoinCircle = async () => {
    if (!validateJoinForm()) return;
    
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add user to joined circles
      mockData.currentUser.joinedCircles.push(selectedCircle.id);
      
      showNotification(`Successfully joined ${selectedCircle.name}!`);
      setShowJoinModal(false);
      setJoinForm({ interest: "", agreeToRules: false });
      setSelectedCircle(null);
    } catch (error) {
      showNotification("Failed to join circle. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCircle = async () => {
    if (!validateCreateForm()) return;
    
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newCircle = {
        id: Date.now(),
        ...createForm,
        createdBy: mockData.currentUser,
        members: 1,
        activeNow: 1,
        messagesCount: 0,
        todayMessages: 0,
        isActive: true,
        createdAt: new Date().toISOString(),
        lastActivity: "Just now",
        tags: [createForm.category.toLowerCase()],
        rating: 5.0,
        weeklyProgress: 0,
        notifications: true,
        moderators: [mockData.currentUser.id],
        messages: []
      };
      
      mockData.bookCircles.unshift(newCircle);
      mockData.currentUser.joinedCircles.push(newCircle.id);
      mockData.currentUser.createdCircles.push(newCircle.id);
      
      showNotification(`Successfully created ${createForm.name}!`);
      setShowCreateModal(false);
      setCreateForm({
        name: "",
        description: "",
        category: "Fantasy",
        isPrivate: false,
        maxMembers: 1000,
        rules: "",
        weeklyGoal: ""
      });
    } catch (error) {
      showNotification("Failed to create circle. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveCircle = async (circleId) => {
    if (window.confirm("Are you sure you want to leave this circle?")) {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Remove user from joined circles
        mockData.currentUser.joinedCircles = mockData.currentUser.joinedCircles.filter(id => id !== circleId);
        
        // Close chat if it's the active circle
        if (activeChatCircle?.id === circleId) {
          setShowChat(false);
          setActiveChatCircle(null);
          setMessages([]);
        }
        
        showNotification("Successfully left the circle.");
      } catch (error) {
        showNotification("Failed to leave circle. Please try again.", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && activeChatCircle) {
      const newMsg = {
        id: Date.now(),
        userId: mockData.currentUser.id,
        text: newMessage,
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        user: "You",
        avatar: mockData.currentUser.avatar,
        likes: 0,
        replies: 0
      };
      
      setMessages(prev => [...prev, newMsg]);
      setNewMessage("");
      
      // Update circle's message count
      const circle = mockData.bookCircles.find(c => c.id === activeChatCircle.id);
      if (circle) {
        circle.messagesCount++;
        circle.todayMessages++;
        circle.lastActivity = "Just now";
      }
    }
  };

  const handleViewChat = (circle) => {
    setActiveChatCircle(circle);
    setMessages(circle.messages || []);
    setShowChat(true);
  };

  const handleToggleNotifications = (circleId) => {
    const circle = mockData.bookCircles.find(c => c.id === circleId);
    if (circle) {
      circle.notifications = !circle.notifications;
      showNotification(
        circle.notifications ? "Notifications enabled" : "Notifications disabled"
      );
    }
  };

  // Render helper functions
  const renderCircleCard = (circle) => {
    const isJoined = isUserJoined(circle.id);
    const isModerator = isUserModerator(circle);
    const membershipPercentage = (circle.members / circle.maxMembers) * 100;

    return (
      <div
        key={circle.id}
        className={`bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden ${
          isJoined ? 'ring-2 ring-blue-200' : ''
        }`}
      >
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center">
                <BookOpen className="text-white" size={20} />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {circle.name}
                  </h3>
                  {circle.isPrivate && (
                    <Shield className="text-yellow-500" size={16} />
                  )}
                  {isModerator && (
                    <Crown className="text-yellow-500" size={16} />
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  {circle.category} • {circle.members.toLocaleString()} members
                </p>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex space-x-2">
              {isJoined ? (
                <>
                  <button className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center">
                    ✓ Joined
                  </button>
                  <button
                    onClick={() => handleViewChat(circle)}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 focus:ring-2 focus:ring-blue-300 transition-colors"
                  >
                    View Chat
                  </button>
                  <button 
                    onClick={() => handleLeaveCircle(circle.id)}
                    className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium hover:bg-red-200 transition-colors"
                  >
                    Leave
                  </button>
                </>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setSelectedCircle(circle);
                    setShowJoinModal(true);
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-300 transition-colors"
                >
                  Join Circle
                </Button>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 mb-4">{circle.description}</p>

          {/* Current book progress */}
          {circle.currentBook && (
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-gray-700">
                  Currently Reading: {circle.currentBook.title}
                </div>
                <div className="text-xs text-gray-500">
                  {circle.currentBook.progress}% complete
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${circle.currentBook.progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <MessageCircle className="mr-1" size={16} />
                <span>{circle.messagesCount} messages today</span>
              </div>
              <div className="flex items-center">
                <Users className="mr-1" size={16} />
                <span>{circle.activeNow} active now</span>
              </div>
            </div>
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-8 h-8 bg-gray-300 rounded-full border-2 border-white" />
              ))}
              <div className="w-8 h-8 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center text-xs text-gray-600">
                +{Math.floor(Math.random() * 10)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderNotification = () => {
    if (!notification) return null;
    
    return (
      <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
        notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
      }`}>
        <div className="flex items-center space-x-2">
          {notification.type === 'success' ? (
            <CheckCircle size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <span>{notification.message}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      {renderNotification()}
      
      <div className="max-w-8xl mx-auto space-y-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-800 to-blue-900 rounded-xl p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
                  <h1 className="text-3xl font-bold mb-2">Book Circles</h1>
                  <p className="text-blue-100 text-lg">
                    Join discussions and connect with fellow readers
                  </p>
                </div>
                <Button
                  variant="primary"
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center space-x-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors text-sm"
                  icon={<Plus size={16} />}
                >
                  Create Circle
                </Button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-4 md:p-6 border border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search circles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  {mockData.genres.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
                <select
                  value={selectedActivity}
                  onChange={(e) => setSelectedActivity(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  <option value="All Activities">All Activities</option>
                  <option value="Active">Active</option>
                  <option value="Recent">Recent</option>
                </select>
              </div>
            </div>

            {/* Book Circles List */}
            <div className="space-y-4">
              {filteredCircles.length > 0 ? (
                filteredCircles.map(renderCircleCard)
              ) : (
                <div className="text-center py-12 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200">
                  <BookOpen className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No book circles found
                  </h3>
                  <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
                </div>
              )}
            </div>
          </div>

          {/* Chat Panel */}
          {showChat && activeChatCircle && (
            <div className="w-100 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 p-4 h-fit sticky top-6 self-start">
              <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
                <div className="flex items-center space-x-2">
                  <Heart className="text-blue-500" size={20} />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {activeChatCircle.name}
                    </h3>
                    <p className="text-sm text-gray-500">{activeChatCircle.activeNow} members online</p>
                  </div>
                </div>
                <button onClick={() => setShowChat(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={20} />
                </button>
              </div>

              <div className="h-96 overflow-y-auto p-2 space-y-4">
                {messages.length > 0 ? (
                  messages.map((message) => (
                    <div key={message.id} className="flex space-x-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-sm text-gray-900">{message.user}</span>
                          <span className="text-xs text-gray-500">{message.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-700">{message.text}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <MessageCircle className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                    <p className="text-sm">No messages yet</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-2 border-t border-gray-200 mt-2">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm"
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-300 disabled:opacity-50"
                    icon={<Send size={16} />}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Join Circle Modal */}
        {selectedCircle && showJoinModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 p-4">
            <div className="bg-white/95 backdrop-blur-md rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      Join {selectedCircle.name}
                    </h3>
                    <p className="text-gray-600">
                      Become a member of this book circle.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowJoinModal(false);
                      setJoinForm({ interest: "", agreeToRules: false });
                      setSelectedCircle(null);
                      setErrors({});
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-gray-600 mb-2">
                      Members: {selectedCircle.members}/{selectedCircle.maxMembers}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Interest
                    </label>
                    <input
                      type="text"
                      value={joinForm.interest}
                      onChange={(e) => handleJoinChange("interest", e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                        errors.interest ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="Why are you interested?..."
                    />
                    {errors.interest && (
                      <p className="text-red-600 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.interest}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="agreeToRules"
                      checked={joinForm.agreeToRules}
                      onChange={(e) => handleJoinChange("agreeToRules", e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="agreeToRules" className="text-sm text-gray-700">
                      I agree to follow the circle rules
                    </label>
                  </div>
                  {errors.agreeToRules && (
                    <p className="text-red-600 text-sm flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.agreeToRules}
                    </p>
                  )}
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowJoinModal(false);
                      setJoinForm({ interest: "", agreeToRules: false });
                      setSelectedCircle(null);
                      setErrors({});
                    }}
                    className="border-gray-200 text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleJoinCircle}
                    disabled={loading || !joinForm.interest || !joinForm.agreeToRules}
                    className="bg-blue-500 hover:bg-blue-600 text-white focus:ring-2 focus:ring-blue-300 disabled:opacity-50"
                    icon={loading ? null : <Plus size={16} />}
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        <span>Joining...</span>
                      </div>
                    ) : (
                      "Join Circle"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Circle Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 p-4">
            <div className="bg-white/95 backdrop-blur-md rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Create New Circle</h3>
                    <p className="text-gray-600">
                      Set up a new book circle for your community.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      setCreateForm({
                        name: "",
                        description: "",
                        category: "Fantasy",
                        isPrivate: false,
                        maxMembers: 1000,
                        rules: "",
                        weeklyGoal: ""
                      });
                      setErrors({});
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Circle Name
                    </label>
                    <input
                      type="text"
                      value={createForm.name}
                      onChange={(e) => handleCreateChange("name", e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                        errors.name ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="Enter circle name..."
                    />
                    {errors.name && (
                      <p className="text-red-600 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={createForm.description}
                      onChange={(e) => handleCreateChange("description", e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 h-20 resize-none ${
                        errors.description ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="Describe your circle..."
                    />
                    {errors.description && (
                      <p className="text-red-600 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.description}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        value={createForm.category}
                        onChange={(e) => handleCreateChange("category", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                      >
                        {mockData.genres.slice(1).map(genre => (
                          <option key={genre} value={genre}>{genre}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Members
                      </label>
                      <input
                        type="number"
                        value={createForm.maxMembers}
                        onChange={(e) => handleCreateChange("maxMembers", parseInt(e.target.value) || 0)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                          errors.maxMembers ? 'border-red-300' : 'border-gray-200'
                        }`}
                        min="10"
                        max="10000"
                      />
                      {errors.maxMembers && (
                        <p className="text-red-600 text-sm mt-1 flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {errors.maxMembers}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isPrivate"
                      checked={createForm.isPrivate}
                      onChange={(e) => handleCreateChange("isPrivate", e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="isPrivate" className="text-sm text-gray-700">
                      Make this a private circle (invite-only)
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowCreateModal(false);
                      setCreateForm({
                        name: "",
                        description: "",
                        category: "Fantasy",
                        isPrivate: false,
                        maxMembers: 1000,
                        rules: "",
                        weeklyGoal: ""
                      });
                      setErrors({});
                    }}
                    className="border-gray-200 text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleCreateCircle}
                    disabled={loading || !createForm.name || !createForm.description}
                    className="bg-blue-500 hover:bg-blue-600 text-white focus:ring-2 focus:ring-blue-300 disabled:opacity-50"
                    icon={loading ? null : <Plus size={16} />}
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        <span>Creating...</span>
                      </div>
                    ) : (
                      "Create Circle"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCircle;