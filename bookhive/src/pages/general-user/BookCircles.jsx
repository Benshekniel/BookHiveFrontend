import { useState, useEffect } from "react";
import { Users, BookOpen, Search, Plus, MessageCircle, X, Send, Heart } from "lucide-react";
import Button from "../../components/shared/Button"; // Assuming Button component is reused

// Mock data - replace with your actual data source
const mockData = {
  currentUser: {
    id: 1,
    name: "Samantha Perera",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  },
  bookCircles: [
    {
      id: 1,
      name: "Fantasy Readers United",
      description:
        "Dive into magical worlds and epic adventures. Currently reading: The Name of the Wind by Patrick Rothfuss",
      category: "Fantasy",
      members: 1247,
      maxMembers: 2000,
      createdBy: {
        name: "John Doe",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      },
      isActive: true,
      activeNow: 89,
      messagesCount: 342,
      recentPost:
        "Dive into magical worlds and epic adventures. Currently reading: The Name of the Wind by Patrick Rothfuss",
      messages: [
        { id: 1, userId: 1, text: "Great discussion today!", timestamp: "2025-06-27 11:45 AM" },
        { id: 2, userId: 2, text: "I loved the character development!", timestamp: "2025-06-27 11:50 AM" },
      ],
      isJoined: false,
    },
    {
      id: 2,
      name: "Romance Book Club",
      description: "Love stories that make your heart flutter. Book of the month: Beach Read by Emily Henry",
      category: "Romance",
      members: 892,
      maxMembers: 1500,
      createdBy: {
        name: "Emily Carter",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
      },
      isActive: true,
      activeNow: 34,
      messagesCount: 156,
      recentPost: "Love stories that make your heart flutter. Book of the month: Beach Read by Emily Henry",
      messages: [
        {
          id: 1,
          userId: 3,
          text: "Just finished Beach Read! The enemies-to-lovers trope was perfectly executed 💕",
          timestamp: "2:34 PM",
          user: "Sarah M.",
        },
        {
          id: 2,
          userId: 4,
          text: "Agreed! Emily Henry really knows how to write chemistry between characters",
          timestamp: "2:36 PM",
          user: "Mike R.",
        },
        {
          id: 3,
          userId: 1,
          text: "What should we read next month? I'm thinking something by Christina Lauren",
          timestamp: "2:38 PM",
          user: "You",
        },
      ],
      isJoined: true,
      onlineMembers: 34,
    },
    {
      id: 3,
      name: "Mystery & Thriller Enthusiasts",
      description:
        "Unravel mysteries and get your adrenaline pumping. Currently discussing: The Silent Patient by Alex Michaelides",
      category: "Mystery",
      members: 567,
      maxMembers: 1000,
      createdBy: {
        name: "Michael Lee",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      },
      isActive: true,
      activeNow: 23,
      messagesCount: 89,
      recentPost:
        "Unravel mysteries and get your adrenaline pumping. Currently discussing: The Silent Patient by Alex Michaelides",
      messages: [],
      isJoined: false,
    },
  ],
};

const BookCircle = () => {
  const [selectedCircle, setSelectedCircle] = useState(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All Genres");
  const [selectedActivity, setSelectedActivity] = useState("All Activities");
  const [joinForm, setJoinForm] = useState({ interest: "" });
  const [showChat, setShowChat] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [activeChatCircle, setActiveChatCircle] = useState(null);

  useEffect(() => {
    // Set default chat to Romance Book Club if joined
    const romanceCircle = mockData.bookCircles.find((circle) => circle.isJoined);
    if (romanceCircle) {
      setActiveChatCircle(romanceCircle);
      setMessages(romanceCircle.messages || []);
      setShowChat(true);
    }
  }, []);

  const handleJoinChange = (field, value) => {
    setJoinForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleJoinCircle = () => {
    console.log("Joining circle:", { selectedCircle, ...joinForm });
    setShowJoinModal(false);
    setJoinForm({ interest: "" });
    setSelectedCircle(null);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && activeChatCircle) {
      const newMsg = {
        id: Date.now(),
        userId: mockData.currentUser.id,
        text: newMessage,
        timestamp: new Date().toLocaleString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        user: "You",
      };
      setMessages((prev) => [...prev, newMsg]);
      setNewMessage("");
    }
  };

  const handleViewChat = (circle) => {
    setActiveChatCircle(circle);
    setMessages(circle.messages || []);
    setShowChat(true);
  };

  const filteredCircles = mockData.bookCircles.filter((circle) => {
    const matchesSearch =
      circle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      circle.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === "All Genres" || circle.category === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white" style={{ fontFamily: "'Open Sans', system-ui, sans-serif" }}>
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-800 to-blue-900 rounded-lg p-4 sm:p-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold" style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}>
                    Book Circles
                  </h1>
                  <p className="text-blue-100 mt-2">Join discussions and connect with fellow readers</p>
                </div>
                <Button
                  variant="primary"
                  icon={<Plus size={16} />}
                  onClick={() => setSelectedCircle({ id: "new", name: "Create New Circle" })}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-yellow-500"
                >
                  Create Circle
                </Button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search circles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="All Genres">All Genres</option>
                  <option value="Fantasy">Fantasy</option>
                  <option value="Romance">Romance</option>
                  <option value="Mystery">Mystery</option>
                </select>
                <select
                  value={selectedActivity}
                  onChange={(e) => setSelectedActivity(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="All Activities">All Activities</option>
                  <option value="Active">Active</option>
                  <option value="Recent">Recent</option>
                </select>
              </div>
            </div>

            {/* Book Circles List */}
            <div className="space-y-4">
              {filteredCircles.map((circle) => (
                <div
                  key={circle.id}
                  className="bg-white rounded-lg shadow-md border border-gray-200 p-4 sm:p-6 transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center">
                        <BookOpen className="text-white" size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg" style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}>
                          {circle.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {circle.category} • {circle.members.toLocaleString()} members
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {circle.isJoined ? (
                        <>
                          <button className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center">
                            ✓ Joined
                          </button>
                          <button
                            onClick={() => handleViewChat(circle)}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 focus:ring-2 focus:ring-yellow-500"
                          >
                            View Chat
                          </button>
                          <button className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium hover:bg-red-200">
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
                          className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-yellow-500"
                        >
                          Join Circle
                        </Button>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">{circle.description}</p>

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
              ))}
            </div>

            {filteredCircles.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}>
                  No book circles found
                </h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>

          {/* Chat Panel */}
          {showChat && activeChatCircle && (
            <div className="w-80 bg-white rounded-lg shadow-md border border-gray-200 p-4 h-fit sticky top-6 self-start">
              <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
                <div className="flex items-center space-x-2">
                  <Heart className="text-yellow-500" size={20} />
                  <div>
                    <h3 className="font-semibold text-gray-900" style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}>
                      {activeChatCircle.name}
                    </h3>
                    <p className="text-sm text-gray-500">{activeChatCircle.onlineMembers} members online</p>
                  </div>
                </div>
                <button onClick={() => setShowChat(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={20} />
                </button>
              </div>

              <div className="h-96 overflow-y-auto p-2 space-y-4">
                {messages.map((message) => (
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
                ))}
              </div>

              <div className="p-2 border-t border-gray-200 mt-2">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-yellow-500"
                    icon={<Send size={16} />}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Join/Create Circle Modal */}
        {selectedCircle && showJoinModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent bg-opacity-50 shadow-2xl">
            <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}>
                    {selectedCircle.id === "new" ? "Create New Circle" : `Join ${selectedCircle.name}`}
                  </h3>
                  <p className="text-gray-600">
                    {selectedCircle.id === "new"
                      ? "Set up a new book circle for your community."
                      : `Become a member of ${selectedCircle.name}.`}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowJoinModal(false);
                    setJoinForm({ interest: "" });
                    setSelectedCircle(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {selectedCircle.id === "new" ? "Circle Name" : "Your Interest"}
                  </label>
                  <input
                    type="text"
                    value={joinForm.interest}
                    onChange={(e) => handleJoinChange("interest", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder={selectedCircle.id === "new" ? "Enter circle name..." : "Why are you interested?..."}
                  />
                </div>
                {selectedCircle.id !== "new" && (
                  <div>
                    <p className="text-sm text-gray-600">
                      Members: {selectedCircle.members}/{selectedCircle.maxMembers}
                    </p>
                  </div>
                )}
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowJoinModal(false);
                    setJoinForm({ interest: "" });
                    setSelectedCircle(null);
                  }}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleJoinCircle}
                  disabled={!joinForm.interest}
                  icon={<Plus size={16} />}
                  className="bg-blue-700 hover:bg-blue-800 text-white focus:ring-2 focus:ring-yellow-500"
                >
                  {selectedCircle.id === "new" ? "Create Circle" : "Join Circle"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCircle;