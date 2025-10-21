import React, { useState, useEffect } from "react";
import axios from "axios";
import NewCompetitions from "./NewCompetitions";
import MyCompetitions from "./MyCompetitions";
import { Trophy, Star, X, Crown } from "lucide-react";
import PropTypes from "prop-types";

// Inline NewButton Component
const NewButton = ({ variant = "primary", size = "md", children, icon, disabled, onClick, ...props }) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    outline: "bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
  };

  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";

  const className = `${baseStyles} ${variantStyles[variant] || variantStyles.primary} ${sizeStyles[size] || sizeStyles.md} ${disabledStyles}`;

  return (
    <button
      className={className}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

NewButton.propTypes = {
  variant: PropTypes.oneOf(["primary", "outline", "success", "danger"]),
  size: PropTypes.oneOf(["sm", "md"]),
  children: PropTypes.node.isRequired,
  icon: PropTypes.node,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

const mockData = {
  currentUser: {
    id: 1,
    name: "Samantha Perera",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  },
  mockSubmissions: [
    { id: 1, userId: 2, name: "John Doe", title: "Lost Horizons", content: "A tale of a lost traveler finding solace in an ancient forest...", votes: 72 },
    { id: 2, userId: 3, name: "Jane Smith", title: "Silent Echoes", content: "Echoes of a forgotten past resonate through an abandoned village...", votes: 60 },
    { id: 3, userId: 1, name: "Samantha Perera", title: "The Journey Home", content: "A journey back to roots uncovers a family legacy...", votes: 85 },
  ],
  mockLeaderboard: [
    { userId: 1, name: "Samantha Perera", votes: 85, submissionTitle: "The Journey Home" },
    { userId: 2, name: "John Doe", votes: 72, submissionTitle: "Lost Horizons" },
    { userId: 3, name: "Jane Smith", votes: 60, submissionTitle: "Silent Echoes" },
  ],
};

const Competitions = () => {
  const [activeTab, setActiveTab] = useState("newCompetitions"); // Changed default to newCompetitions
  const [competitions, setCompetitions] = useState([]);
  const [userParticipatedCompetitions, setUserParticipatedCompetitions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [votes, setVotes] = useState({});
  const baseUrl = "http://localhost:9090";
  const userEmail = "user@example.com"; // Replace with authenticated user's email

  const formatDateForDisplay = (dateStr) => {
    if (!dateStr) return "Not set";
    const date = new Date(dateStr);
    date.setHours(date.getHours() + 5);
    date.setMinutes(date.getMinutes() + 30);
    return isNaN(date.getTime()) ? "Not set" : date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  };

  const fetchCompetitions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(`${baseUrl}/api/getAllCompetitions`);
      const fetchedCompetitions = response.data.map((comp) => ({
        id: comp.competitionid,
        title: comp.title || "Untitled",
        category: comp.theme || "Writing",
        description: comp.description || "No description",
        prize: comp.prizetrustscore ? comp.prizetrustscore : "Not specified",
        featured: comp.activestatus || false,
        currentparticipants: comp.currentparticipants ?? 0, // Correct field name
        maxParticipants: comp.maxparticipants || 100,
        organizer: {
          name: comp.createdby || "Unknown Organizer",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
        },
        rules: comp.rules ? JSON.parse(comp.rules) : [],
        judgesCriteria: comp.judgingcriteria ? JSON.parse(comp.judgingcriteria) : [],
        submissions: comp.competitionid === "b7e1d4d1" ? mockData.mockSubmissions : [],
        leaderboard: comp.competitionid === "b7e1d4d1" ? mockData.mockLeaderboard : [],
        startDatetime: comp.startdatetime,
        endDatetime: comp.enddatetime,
        votingEndDatetime: comp.votingenddatetime,
        deadline: formatDateForDisplay(comp.votingenddatetime),
        trustScoreRequirement: comp.entrytrustscore ?? 0,
      }));
      setCompetitions(fetchedCompetitions);
    } catch (err) {
      const errorMessage = "Failed to fetch competitions: " + (err.response?.data?.message || err.message);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserParticipatedCompetitions = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/participating/${userEmail}`);
      setUserParticipatedCompetitions(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch user competitions");
    }
  };

  useEffect(() => {
    fetchCompetitions();
    fetchUserParticipatedCompetitions();
  }, []);

  const handleJoinSuccess = (id) => {
    setUserParticipatedCompetitions((prev) => {
      if (!prev.includes(id)) {
        return [...prev, id];
      }
      return prev.filter((compId) => compId !== id); // Update for leave action
    });
    // Refetch competitions to update currentparticipants
    fetchCompetitions();
  };

  const isDeadlinePassed = (deadline) => {
    const deadlineDate = new Date(deadline);
    const currentDate = new Date();
    return deadlineDate < currentDate;
  };

  const openSubmissionModal = (competition) => {
    setSelectedCompetition(competition);
  };

  const handleVote = (competitionId, submissionId) => {
    const key = `${competitionId}-${submissionId}`;
    setVotes((prev) => ({
      ...prev,
      [key]: (prev[key] || 0) === 0 ? 1 : 0,
    }));
  };

  const getCurrentVotes = (competitionId, submissionId, originalVotes) => {
    const key = `${competitionId}-${submissionId}`;
    return originalVotes + (votes[key] || 0);
  };

  const getLeaderboard = (competition) => {
    if (!competition.submissions) return [];
    return competition.submissions
      .map((sub) => ({
        userId: sub.userId,
        name: sub.name,
        votes: getCurrentVotes(competition.id, sub.id, sub.votes),
        submissionTitle: sub.title,
      }))
      .sort((a, b) => b.votes - a.votes);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        {isLoading && (
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-2 text-gray-600">Loading competitions...</span>
          </div>
        )}
        <div className="mb-6">
          <div className="flex space-x-4 border-b border-gray-200">
            <button
              className={`pb-2 px-4 ${activeTab === "newCompetitions" ? "border-b-2 border-yellow-500 text-yellow-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("newCompetitions")}
            >
              New Competitions
            </button>
            <button
              className={`pb-2 px-4 ${activeTab === "myCompetitions" ? "border-b-2 border-yellow-500 text-yellow-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("myCompetitions")}
            >
              My Competitions
            </button>
            <button
              className={`pb-2 px-4 ${activeTab === "voting" ? "border-b-2 border-yellow-500 text-yellow-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("voting")}
            >
              Voting
            </button>
            <button
              className={`pb-2 px-4 ${activeTab === "yourSubmissions" ? "border-b-2 border-yellow-500 text-yellow-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("yourSubmissions")}
            >
              Your Submissions
            </button>
          </div>
        </div>

        {activeTab === "yourSubmissions" && (
          <section>
            <div className="bg-gradient-to-r from-blue-800 to-blue-900 rounded-xl p-6 text-white mb-6">
              <h2 className="text-2xl font-bold mb-2">Your Submissions for Ended Competitions</h2>
              <p className="text-green-100">View your submissions and results from past competitions</p>
            </div>
            <div className="text-center py-16">
              <Trophy className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No ended competition submissions yet</h3>
              <p className="text-gray-500 mb-6">Your submissions from ended competitions will appear here</p>
              <NewButton
                variant="primary"
                onClick={() => setActiveTab("newCompetitions")}
                icon={<Trophy size={16} />}
              >
                Browse Competitions
              </NewButton>
            </div>
          </section>
        )}

        {activeTab === "voting" && (
          <section>
            <div className="bg-gradient-to-r from-blue-800 to-blue-900 rounded-xl p-6 text-white mb-6">
              <h2 className="text-2xl font-bold mb-2">Voting for Past Writing Competitions</h2>
              <p className="text-blue-100">Cast your votes and view the leaderboard</p>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {competitions.filter((c) => isDeadlinePassed(c.votingEndDatetime)).map((competition) => (
                <div key={competition.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-grow">
                        <h3 className="font-semibold text-gray-900 text-lg mb-1">{competition.title}</h3>
                        <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                          {competition.category}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">Deadline: {competition.deadline} (Closed)</p>
                    {competition.submissions && competition.submissions.length > 0 && (
                      <div className="space-y-4 mb-6">
                        <h4 className="font-semibold text-gray-900 text-lg mb-2">Competitor Submissions</h4>
                        {competition.submissions
                          .filter((s) => s.userId !== mockData.currentUser.id)
                          .map((submission) => {
                            const currentVotes = getCurrentVotes(competition.id, submission.id, submission.votes);
                            return (
                              <div key={submission.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition">
                                <h5 className="font-medium text-gray-900">{submission.title} by {submission.name}</h5>
                                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{submission.content.substring(0, 50)}...</p>
                                <div className="flex items-center text-sm text-gray-600 mb-2">
                                  <Star size={14} className="mr-1 text-yellow-500" />
                                  {currentVotes} votes
                                </div>
                                <NewButton
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedCompetition({ ...submission, competitionId: competition.id });
                                    setActiveTab("viewSubmission");
                                  }}
                                >
                                  View Content
                                </NewButton>
                              </div>
                            );
                          })}
                      </div>
                    )}
                    {competition.leaderboard && competition.leaderboard.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-semibold text-gray-900 text-lg mb-4">Leaderboard</h4>
                        <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-4 rounded-lg shadow-inner">
                          {getLeaderboard(competition).map((entry, index) => {
                            const isCurrentUser = entry.userId === mockData.currentUser.id;
                            return (
                              <div
                                key={entry.userId}
                                className={`flex items-center justify-between p-3 mb-2 rounded-lg ${
                                  isCurrentUser ? "bg-blue-50 border border-blue-200" : "bg-white"
                                } transition-all hover:bg-gray-50`}
                              >
                                <div className="flex items-center space-x-3">
                                  {index === 0 && <Crown className="text-yellow-500" size={20} />}
                                  {index === 1 && <Crown className="text-gray-400" size={20} />}
                                  {index === 2 && <Crown className="text-amber-700" size={20} />}
                                  <span className={`font-bold ${index < 3 ? "text-xl" : "text-lg"} ${isCurrentUser ? "text-blue-600" : "text-gray-800"}`}>
                                    {index + 1}.
                                  </span>
                                  <span className="font-medium">{entry.name}</span>
                                  <span className="text-gray-600 text-sm">({entry.submissionTitle})</span>
                                </div>
                                <span className="font-bold text-yellow-600 text-lg">{entry.votes} <Star size={16} /></span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {competition.submissions && competition.submissions.some(s => s.userId === mockData.currentUser.id) && (
                      <div className="mt-6">
                        <h4 className="font-semibold text-gray-900 text-lg mb-4">Your Submission</h4>
                        {competition.submissions
                          .filter(s => s.userId === mockData.currentUser.id)
                          .map((submission) => {
                            const currentVotes = getCurrentVotes(competition.id, submission.id, submission.votes);
                            return (
                              <div key={submission.id} className="p-4 bg-green-50 rounded-lg border border-green-200">
                                <h5 className="font-medium text-gray-900">{submission.title}</h5>
                                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{submission.content}</p>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-green-600">Your Votes: {currentVotes}</span>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === "newCompetitions" && (
          <NewCompetitions
            competitions={competitions}
            openSubmissionModal={openSubmissionModal}
            isDeadlinePassed={isDeadlinePassed}
            userParticipatedCompetitions={userParticipatedCompetitions}
            onJoinSuccess={handleJoinSuccess}
          />
        )}

        {activeTab === "myCompetitions" && (
          <MyCompetitions
            competitions={competitions}
            userSubmissions={mockData.userSubmissions}
            userParticipatedCompetitions={userParticipatedCompetitions}
          />
        )}

        {activeTab === "viewSubmission" && selectedCompetition && (
          <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">View Submission</h3>
                    <p className="text-gray-600">{selectedCompetition.title} by {selectedCompetition.name}</p>
                  </div>
                  <button
                    onClick={() => setActiveTab("voting")}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 max-h-96 overflow-y-auto">
                      <div
                        className="text-gray-700 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: selectedCompetition.content }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center text-sm font-medium text-gray-700">
                    <Star size={16} className="mr-1 text-yellow-500" />
                    Current Votes: {getCurrentVotes(selectedCompetition.competitionId, selectedCompetition.id, selectedCompetition.votes)}
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <NewButton
                    variant="outline"
                    onClick={() => setActiveTab("voting")}
                  >
                    Close
                  </NewButton>
                  {selectedCompetition.userId && selectedCompetition.userId !== mockData.currentUser.id && (
                    <NewButton
                      variant="primary"
                      onClick={() => handleVote(selectedCompetition.competitionId, selectedCompetition.id)}
                      icon={<Star size={16} />}
                    >
                      {(votes[`${selectedCompetition.competitionId}-${selectedCompetition.id}`] || 0) > 0 ? "Remove Vote" : "Vote"}
                    </NewButton>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Competitions;



// import React, { useState, useEffect, useRef } from "react";
// import { Trophy, Calendar, Star, Send, Search, Users, FileText, X, Crown, Edit, Trash2, Eye, Clock, Award, TrendingUp } from "lucide-react";
// import axios from "axios";
// import { Editor } from '@tinymce/tinymce-react';
// import CompetitionSubmission from "./CompetitionSubmission";

// const mockData = {
//   currentUser: {
//     id: 1,
//     name: "Samantha Perera",
//     avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
//   },
//   userSubmissions: [
//     {
//       id: 1,
//       title: "The Journey Home",
//       competitionId: "b7e1d4d1", 
//       status: "Under Review",
//       submittedAt: "2024-01-20", wordCount: 2450,
//       votes: 85,
//       content: "A journey back to roots uncovers a family legacy hidden beneath the ruins of an old estate...",
//       feedback: "Excellent character development and vivid descriptions. The narrative flow is compelling.",
//       ranking: 1,
//       totalEntries: 45
//     },
//     {
//       id: 2,
//       title: "Future Horizons",
//       competitionId: "34394c1e", 
//       status: "Submitted",
//       submittedAt: "2024-02-15",
//       wordCount: 1150,
//       votes: 0,
//       content: "The future of writing lies not in replacing human creativity with artificial intelligence...",
//       feedback: null,
//       ranking: null,
//       totalEntries: 28
//     },
//     {
//       id: 3,
//       title: "Whispers of the Past",
//       competitionId: "b7e1d4d1", 
//       status: "Draft",
//       submittedAt: null,
//       wordCount: 890,
//       votes: 0,
//       content: "In the quiet corners of the old library, where dust motes danced in shafts of golden sunlight...",
//       feedback: null,
//       ranking: null,
//       totalEntries: null
//     }
//   ],
//   mockSubmissions: [
//     { id: 1, userId: 2, name: "John Doe", title: "Lost Horizons", content: "A tale of a lost traveler finding solace in an ancient forest...", votes: 72 },
//     { id: 2, userId: 3, name: "Jane Smith", title: "Silent Echoes", content: "Echoes of a forgotten past resonate through an abandoned village...", votes: 60 },
//     { id: 3, userId: 1, name: "Samantha Perera", title: "The Journey Home", content: "A journey back to roots uncovers a family legacy...", votes: 85 },
//   ],
//   mockLeaderboard: [
//     { userId: 1, name: "Samantha Perera", votes: 85, submissionTitle: "The Journey Home" },
//     { userId: 2, name: "John Doe", votes: 72, submissionTitle: "Lost Horizons" },
//     { userId: 3, name: "Jane Smith", votes: 60, submissionTitle: "Silent Echoes" },
//   ]
// };

// const Button = ({ children, variant = "primary", size = "md", icon, className = "", onClick, disabled = false, ...props }) => {
//   const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
//   const variants = {
//     primary: "bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500 disabled:hover:bg-yellow-500",
//     secondary: "bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 focus:ring-blue-500",
//     outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500",
//     danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 disabled:hover:bg-red-500",
//     success: "bg-green-500 text-white hover:bg-green-600 focus:ring-green-500 disabled:hover:bg-green-500",
//   };
//   const sizes = {
//     sm: "px-3 py-1.5 text-sm",
//     md: "px-4 py-2 text-sm",
//     lg: "px-6 py-3 text-base",
//   };

//   return (
//     <button className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`} onClick={onClick} disabled={disabled} {...props}>
//       {icon && <span className="mr-2">{icon}</span>}
//       {children}
//     </button>
//   );
// };

// const getStatusColor = (status) => {
//   switch (status.toLowerCase()) {
//     case "under review":
//       return "bg-yellow-100 text-yellow-800 border-yellow-200";
//     case "submitted":
//       return "bg-green-100 text-green-800 border-green-200";
//     case "active":
//       return "bg-blue-100 text-blue-800 border-blue-200";
//     case "draft":
//       return "bg-gray-100 text-gray-800 border-gray-200";
//     case "winner":
//       return "bg-purple-100 text-purple-800 border-purple-200";
//     default:
//       return "bg-gray-100 text-gray-800 border-gray-200";
//   }
// };

// const Competitions = () => {
//   const [activeTab, setActiveTab] = useState("yourSubmissions");
//   const [selectedCompetition, setSelectedCompetition] = useState(null);
//   const [showSubmissionModal, setShowSubmissionModal] = useState(false);
//   const [selectedSubmission, setSelectedSubmission] = useState(null);
//   const [showContentModal, setShowContentModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [editingSubmission, setEditingSubmission] = useState(null);
//   const [editForm, setEditForm] = useState({ title: "", content: "", wordCount: 0 });
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [selectedStatus, setSelectedStatus] = useState("");
//   const [votes, setVotes] = useState({});
//   const [userSubmissions, setUserSubmissions] = useState(mockData.userSubmissions);
//   const [competitions, setCompetitions] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
  
//   // New state for tracking API operations
//   const [isEditing, setIsEditing] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [editError, setEditError] = useState(null);
//   const [submitError, setSubmitError] = useState(null);
//   const [deleteError, setDeleteError] = useState(null);

//   const baseUrl = "http://localhost:9090";
//   const editorRef = useRef(null);

//   const formatDateForDisplay = (dateStr) => {
//     if (!dateStr) return "Not set";
//     const date = new Date(dateStr);
//     return isNaN(date.getTime()) ? "Not set" : date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
//   };

//   useEffect(() => {
//     const fetchCompetitions = async () => {
//       try {
//         setIsLoading(true);
//         setError(null);
//         const response = await axios.get(`${baseUrl}/api/getAllCompetitions`);
//         console.log("Fetched competitions:", response.data);

//         const fetchedCompetitions = response.data.map((comp) => ({
//           id: comp.competitionid,
//           title: comp.title || "Untitled",
//           category: comp.theme || "Writing",
//           description: comp.description || "No description",
//           prize: comp.prizetrustscore ? `Trustscore Increment: ${comp.prizetrustscore}` : "Trustscore Increment",
//           deadline: formatDateForDisplay(comp.votingenddatetime),
//           featured: comp.activestatus || false,
//           participants: comp.currentparticipants || 0,
//           maxParticipants: comp.maxparticipants || 100,
//           organizer: {
//             name: comp.createdby || "Unknown Organizer",
//             avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
//           },
//           rules: comp.rules ? JSON.parse(comp.rules) : [],
//           judgesCriteria: comp.judgingcriteria ? JSON.parse(comp.judgingcriteria) : [],
//           submissions: comp.competitionid === "b7e1d4d1" ? mockData.mockSubmissions : [],
//           leaderboard: comp.competitionid === "b7e1d4d1" ? mockData.mockLeaderboard : [],
//         }));

//         console.log("Mapped competitions:", fetchedCompetitions);
//         setCompetitions(fetchedCompetitions);
//       } catch (err) {
//         const errorMessage = "Failed to fetch competitions: " + (err.response?.data?.message || err.message);
//         console.error("Fetch error:", err);
//         setError(errorMessage);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchCompetitions();
//   }, []);

//   // Fetch user submissions on component mount
//   useEffect(() => {
//     const fetchUserSubmissions = async () => {
//       try {
//         setIsLoading(true);
//         // You can uncomment this when your backend is ready
//         /*
//         const response = await axios.get(`${baseUrl}/api/user/getSubmissions`);
//         if (response.data && Array.isArray(response.data)) {
//           setUserSubmissions(response.data);
//         }
//         */
//       } catch (err) {
//         console.error("Error fetching user submissions:", err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     // Uncomment to enable when backend is ready
//     // fetchUserSubmissions();
//   }, []);

//   const handleEditChange = (field, value) => {
//     if (field === "content") {
//       // Calculate word count from HTML content
//       const textOnly = value.replace(/<[^>]*>/g, ' ');
//       const words = textOnly.split(/\s+/).filter(word => word.length > 0);
      
//       setEditForm((prev) => ({
//         ...prev,
//         content: value,
//         wordCount: words.length,
//       }));
//     } else {
//       setEditForm((prev) => ({
//         ...prev,
//         [field]: value,
//       }));
//     }
//   };

//   // Function to handle new submissions from the CompetitionSubmission component
//   const handleNewSubmission = (newSubmission) => {
//     setUserSubmissions(prev => [...prev, newSubmission]);
//   };

//   // Function to open submission modal
//   const openSubmissionModal = (competition) => {
//     setSelectedCompetition(competition);
//     setShowSubmissionModal(true);
//   };
  
//   // Function to open competition details
//   const openCompetitionDetails = (competition) => {
//     if (!showSubmissionModal) {
//       setSelectedCompetition(competition);
//     }
//   };

//   // Updated to use backend integration
//   const handleEditSubmission = async () => {
//     if (editingSubmission) {
//       setIsEditing(true);
//       setEditError(null);
      
//       try {
//         const submissionData = {
//           submissionId: editingSubmission.id, // Include the ID since we're editing
//           competitionId: editingSubmission.competitionId,
//           email: "", // Will be extracted from JWT token on the server
//           userId: "", // Will be extracted from JWT token on the server
//           title: editForm.title,
//           content: editForm.content
//         };
        
//         const response = await axios.post(
//           'http://localhost:9090/api/userSaveStory',
//           submissionData,
//           {
//             headers: {
//               'Content-Type': 'application/json'
//               // Auth token would be included here
//             }
//           }
//         );
        
//         const result = response.data;
        
//         if (result.message === 'success') {
//           // Update local state
//           setUserSubmissions(prev => prev.map(sub => 
//             sub.id === editingSubmission.id 
//               ? { ...sub, title: editForm.title, content: editForm.content, wordCount: editForm.wordCount }
//               : sub
//           ));
          
//           setShowEditModal(false);
//           setEditingSubmission(null);
//           setEditForm({ title: "", content: "", wordCount: 0 });
//         } else {
//           setEditError('Failed to update submission: ' + result.message);
//         }
//       } catch (error) {
//         console.error("Error updating submission:", error);
//         setEditError('Error updating submission: ' + (error.response?.data?.message || error.message));
//       } finally {
//         setIsEditing(false);
//       }
//     }
//   };

//   // Updated to use backend integration
//   const handleSubmitToCompetition = async (submission) => {
//     setIsSubmitting(true);
//     setSubmitError(null);
    
//     try {
//       const submissionData = {
//         submissionId: submission.id,
//         competitionId: submission.competitionId,
//         email: "", // Will be extracted from JWT token on the server
//         userId: "", // Will be extracted from JWT token on the server
//         title: submission.title,
//         content: submission.content,
//         status: "Submitted" // You might need to add this to your DTO or handle it server-side
//       };
      
//       const response = await axios.post(
//         'http://localhost:9090/api/userSaveStory',
//         submissionData,
//         {
//           headers: {
//             'Content-Type': 'application/json'
//           }
//         }
//       );
      
//       const result = response.data;
      
//       if (result.message === 'success') {
//         setUserSubmissions(prev => prev.map(sub => 
//           sub.id === submission.id 
//             ? { ...sub, status: 'Submitted', submittedAt: new Date().toISOString().split('T')[0] }
//             : sub
//         ));
//       } else {
//         setSubmitError("Failed to submit entry: " + result.message);
//       }
//     } catch (error) {
//       console.error("Error submitting entry:", error);
//       setSubmitError("Error submitting entry: " + (error.response?.data?.message || error.message));
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Updated to use backend integration
//   const handleDeleteSubmission = async (submissionId) => {
//     setIsDeleting(true);
//     setDeleteError(null);
    
//     try {
//       // You might need a separate endpoint for deletion or use the same with a delete flag
//       const response = await axios.delete(
//         `http://localhost:9090/api/user/deleteSubmission/${submissionId}`
//       );
      
//       const result = response.data;
      
//       if (result.message === 'success') {
//         setUserSubmissions(prev => prev.filter(sub => sub.id !== submissionId));
//         setShowDeleteModal(false);
//         setSelectedSubmission(null);
//       } else {
//         setDeleteError("Failed to delete submission: " + result.message);
//       }
//     } catch (error) {
//       console.error("Error deleting submission:", error);
//       setDeleteError("Error deleting submission: " + (error.response?.data?.message || error.message));
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   const handleVote = (competitionId, submissionId) => {
//     const key = `${competitionId}-${submissionId}`;
//     setVotes((prev) => ({
//       ...prev,
//       [key]: (prev[key] || 0) === 0 ? 1 : 0,
//     }));
//   };

//   const getCurrentVotes = (competitionId, submissionId, originalVotes) => {
//     const key = `${competitionId}-${submissionId}`;
//     return originalVotes + (votes[key] || 0);
//   };

//   const getLeaderboard = (competition) => {
//     if (!competition.submissions) return [];
//     return competition.submissions
//       .map((sub) => ({
//         userId: sub.userId,
//         name: sub.name,
//         votes: getCurrentVotes(competition.id, sub.id, sub.votes),
//         submissionTitle: sub.title,
//       }))
//       .sort((a, b) => b.votes - a.votes);
//   };

//   const openEditModal = (submission) => {
//     setEditingSubmission(submission);
//     setEditForm({
//       title: submission.title,
//       content: submission.content,
//       wordCount: submission.wordCount
//     });
//     setShowEditModal(true);
//     setEditError(null);
//   };

//   const openDeleteModal = (submission) => {
//     setSelectedSubmission(submission);
//     setShowDeleteModal(true);
//     setDeleteError(null);
//   };

//   const isDeadlinePassed = (deadline) => {
//     const deadlineDate = new Date(deadline);
//     const currentDate = new Date("2025-09-03");
//     return deadlineDate < currentDate;
//   };

//   const filteredCompetitions = competitions.filter((competition) => {
//     const matchesSearch =
//       competition.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       competition.description.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesCategory = !selectedCategory || competition.category === selectedCategory;
//     const matchesStatus =
//       !selectedStatus ||
//       (selectedStatus === "Active" && !isDeadlinePassed(competition.deadline) && competition.participants < competition.maxParticipants) ||
//       (selectedStatus === "Ending Soon" && competition.featured && !isDeadlinePassed(competition.deadline));
//     return matchesSearch && matchesCategory && matchesStatus;
//   });

//   const pastCompetitions = competitions.filter((competition) => isDeadlinePassed(competition.deadline));

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto p-6">
//         {error && (
//           <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
//             {error}
//           </div>
//         )}
//         {isLoading && (
//           <div className="flex items-center justify-center">
//             <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//             <span className="ml-2 text-gray-600">Loading competitions...</span>
//           </div>
//         )}
//         <div className="mb-6">
//           <div className="flex space-x-4 border-b border-gray-200">
//             <button
//               className={`pb-2 px-4 ${activeTab === "yourSubmissions" ? "border-b-2 border-yellow-500 text-yellow-600" : "text-gray-500 hover:text-gray-700"}`}
//               onClick={() => setActiveTab("yourSubmissions")}
//             >
//               Your Submissions
//             </button>
//             <button
//               className={`pb-2 px-4 ${activeTab === "voting" ? "border-b-2 border-yellow-500 text-yellow-600" : "text-gray-500 hover:text-gray-700"}`}
//               onClick={() => setActiveTab("voting")}
//             >
//               Voting
//             </button>
//             <button
//               className={`pb-2 px-4 ${activeTab === "newCompetitions" ? "border-b-2 border-yellow-500 text-yellow-600" : "text-gray-500 hover:text-gray-700"}`}
//               onClick={() => setActiveTab("newCompetitions")}
//             >
//               New Competitions
//             </button>
//           </div>
//         </div>

//         {activeTab === "yourSubmissions" && (
//           <section>
//             <div className="bg-gradient-to-r from-blue-800 to-blue-900 rounded-xl p-6 text-white mb-6">
//               <h2 className="text-2xl font-bold mb-2">Your Writing Submissions</h2>
//               <p className="text-green-100">Manage your submitted entries and track your progress</p>
//             </div>
            
//             {userSubmissions.length > 0 ? (
//               <div className="space-y-6">
//                 {userSubmissions.map((submission) => {
//                   const competition = competitions.find((c) => c.id === submission.competitionId);
//                   const isWinner = submission.ranking === 1;
//                   const isTopThree = submission.ranking && submission.ranking <= 3;
                  
//                   return (
//                     <div
//                       key={submission.id}
//                       className={`bg-white rounded-xl shadow-sm border-2 hover:shadow-md transition-all duration-300 ${
//                         isWinner ? 'border-yellow-300 bg-gradient-to-r from-yellow-50 to-amber-50' :
//                         isTopThree ? 'border-green-300 bg-gradient-to-r from-green-50 to-emerald-50' :
//                         'border-gray-200 hover:border-gray-300'
//                       }`}
//                     >
//                       <div className="p-6">
//                         <div className="flex justify-between items-start mb-4">
//                           <div className="flex-grow">
//                             <div className="flex items-center space-x-3 mb-2">
//                               <h3 className="font-bold text-gray-900 text-xl">{submission.title}</h3>
//                               {isWinner && (
//                                 <div className="flex items-center bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
//                                   <Crown size={16} className="mr-1" />
//                                   Winner
//                                 </div>
//                               )}
//                               {isTopThree && !isWinner && (
//                                 <div className="flex items-center bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
//                                   <Award size={16} className="mr-1" />
//                                   Top {submission.ranking}
//                                 </div>
//                               )}
//                             </div>
//                             <p className="text-gray-600 mb-2">{competition?.title || "Unknown Competition"}</p>
//                             <div className="flex items-center space-x-4 text-sm text-gray-500">
//                               <span className="flex items-center">
//                                 <Calendar size={14} className="mr-1" />
//                                 {submission.submittedAt ? `Submitted: ${submission.submittedAt}` : 'Not submitted yet'}
//                               </span>
//                               <span className="flex items-center">
//                                 <FileText size={14} className="mr-1" />
//                                 {submission.wordCount} words
//                               </span>
//                               {submission.votes > 0 && (
//                                 <span className="flex items-center">
//                                   <Star size={14} className="mr-1" />
//                                   {submission.votes} votes
//                                 </span>
//                               )}
//                               {submission.ranking && (
//                                 <span className="flex items-center">
//                                   <TrendingUp size={14} className="mr-1" />
//                                   Rank {submission.ranking} of {submission.totalEntries}
//                                 </span>
//                               )}
//                             </div>
//                           </div>
//                           <div className="flex items-center space-x-2">
//                             <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(submission.status)}`}>
//                               {submission.status}
//                             </span>
//                           </div>
//                         </div>

//                         {submission.feedback && (
//                           <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
//                             <h4 className="font-semibold text-blue-900 mb-2">Judge Feedback</h4>
//                             <p className="text-blue-800">{submission.feedback}</p>
//                           </div>
//                         )}

//                         {submitError && submission.status === 'Draft' && (
//                           <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
//                             {submitError}
//                           </div>
//                         )}

//                         <div className="flex justify-between items-center">
//                           <div className="flex items-center space-x-3">
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               onClick={() => {
//                                 setSelectedSubmission(submission);
//                                 setShowContentModal(true);
//                               }}
//                               icon={<Eye size={16} />}
//                             >
//                               View
//                             </Button>
//                             {submission.status === 'Draft' && (
//                               <Button
//                                 variant="primary"
//                                 size="sm"
//                                 onClick={() => openEditModal(submission)}
//                                 icon={<Edit size={16} />}
//                               >
//                                 Edit
//                               </Button>
//                             )}
//                             <Button
//                               variant="danger"
//                               size="sm"
//                               onClick={() => openDeleteModal(submission)}
//                               icon={<Trash2 size={16} />}
//                               disabled={isDeleting}
//                             >
//                               {isDeleting ? "Deleting..." : "Delete"}
//                             </Button>
//                           </div>
                          
//                           {submission.status === 'Draft' && (
//                             <Button
//                               variant="success"
//                               size="sm"
//                               onClick={() => handleSubmitToCompetition(submission)}
//                               icon={<Send size={16} />}
//                               disabled={isSubmitting}
//                             >
//                               {isSubmitting ? (
//                                 <>
//                                   <span className="mr-2">Submitting...</span>
//                                   <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                                 </>
//                               ) : "Submit"}
//                             </Button>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             ) : (
//               <div className="text-center py-16">
//                 <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
//                   <FileText className="mx-auto h-16 w-16 text-gray-300 mb-4" />
//                   <h3 className="text-xl font-semibold text-gray-900 mb-2">No submissions yet</h3>
//                   <p className="text-gray-500 mb-6">Ready to showcase your writing skills? Submit your first entry!</p>
//                   <Button
//                     variant="primary"
//                     onClick={() => setActiveTab("newCompetitions")}
//                     icon={<Trophy size={16} />}
//                   >
//                     Browse Competitions
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </section>
//         )}

//         {activeTab === "voting" && (
//           <section>
//             <div className="bg-gradient-to-r from-blue-800 to-blue-900 rounded-xl p-6 text-white mb-6">
//               <h2 className="text-2xl font-bold mb-2">Voting for Past Writing Competitions</h2>
//               <p className="text-blue-100">Cast your votes and view the leaderboard</p>
//             </div>
//             <div className="grid grid-cols-1 gap-6">
//               {pastCompetitions.length > 0 ? (
//                 pastCompetitions.map((competition) => (
//                   <div key={competition.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//                     <div className="p-6">
//                       <div className="flex justify-between items-start mb-3">
//                         <div className="flex-grow">
//                           <h3 className="font-semibold text-gray-900 text-lg mb-1">{competition.title}</h3>
//                           <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
//                             {competition.category}
//                           </span>
//                         </div>
//                       </div>
//                       <p className="text-gray-600 text-sm mb-4">Deadline: {competition.deadline} (Closed)</p>
//                       {competition.submissions && competition.submissions.length > 0 && (
//                         <div className="space-y-4 mb-6">
//                           <h4 className="font-semibold text-gray-900 text-lg mb-2">Competitor Submissions</h4>
//                           {competition.submissions
//                             .filter((s) => s.userId !== mockData.currentUser.id)
//                             .map((submission) => {
//                               const currentVotes = getCurrentVotes(competition.id, submission.id, submission.votes);
//                               return (
//                                 <div key={submission.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition">
//                                   <h5 className="font-medium text-gray-900">{submission.title} by {submission.name}</h5>
//                                   <p className="text-gray-600 text-sm mb-2 line-clamp-2">{submission.content.substring(0, 50)}...</p>
//                                   <div className="flex items-center text-sm text-gray-600 mb-2">
//                                     <Star size={14} className="mr-1 text-yellow-500" />
//                                     {currentVotes} votes
//                                   </div>
//                                   <Button
//                                     variant="outline"
//                                     size="sm"
//                                     onClick={() => {
//                                       setSelectedSubmission({ ...submission, competitionId: competition.id });
//                                       setShowContentModal(true);
//                                     }}
//                                   >
//                                     View Content
//                                   </Button>
//                                 </div>
//                               );
//                             })}
//                         </div>
//                       )}
//                       {competition.leaderboard && competition.leaderboard.length > 0 && (
//                         <div className="mt-6">
//                           <h4 className="font-semibold text-gray-900 text-lg mb-4">Leaderboard</h4>
//                           <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-4 rounded-lg shadow-inner">
//                             {getLeaderboard(competition).map((entry, index) => {
//                               const isCurrentUser = entry.userId === mockData.currentUser.id;
//                               return (
//                                 <div
//                                   key={entry.userId}
//                                   className={`flex items-center justify-between p-3 mb-2 rounded-lg ${
//                                     isCurrentUser ? "bg-blue-50 border border-blue-200" : "bg-white"
//                                   } transition-all hover:bg-gray-50`}
//                                 >
//                                   <div className="flex items-center space-x-3">
//                                     {index === 0 && <Crown className="text-yellow-500" size={20} />}
//                                     {index === 1 && <Crown className="text-gray-400" size={20} />}
//                                     {index === 2 && <Crown className="text-amber-700" size={20} />}
//                                     <span className={`font-bold ${index < 3 ? "text-xl" : "text-lg"} ${
//                                       isCurrentUser ? "text-blue-600" : "text-gray-800"
//                                     }`}>
//                                       {index + 1}.
//                                     </span>
//                                     <span className="font-medium">{entry.name}</span>
//                                     <span className="text-gray-600 text-sm">({entry.submissionTitle})</span>
//                                   </div>
//                                   <span className="font-bold text-yellow-600 text-lg">{entry.votes} <Star size={16} /></span>
//                                 </div>
//                               );
//                             })}
//                           </div>
//                         </div>
//                       )}
//                       {competition.submissions && competition.submissions.some(s => s.userId === mockData.currentUser.id) && (
//                         <div className="mt-6">
//                           <h4 className="font-semibold text-gray-900 text-lg mb-4">Your Submission</h4>
//                           {competition.submissions
//                             .filter(s => s.userId === mockData.currentUser.id)
//                             .map((submission) => {
//                               const currentVotes = getCurrentVotes(competition.id, submission.id, submission.votes);
//                               return (
//                                 <div key={submission.id} className="p-4 bg-green-50 rounded-lg border border-green-200">
//                                   <h5 className="font-medium text-gray-900">{submission.title}</h5>
//                                   <p className="text-gray-600 text-sm mb-2 line-clamp-2">{submission.content}</p>
//                                   <div className="flex items-center justify-between">
//                                     <span className="text-sm font-medium text-green-600">Your Votes: {currentVotes}</span>
//                                   </div>
//                                 </div>
//                               );
//                             })}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center py-12">
//                   <Trophy className="mx-auto h-12 w-12 text-gray-300 mb-3" />
//                   <h3 className="text-lg font-semibold text-gray-900 mb-2">No past competitions available for voting</h3>
//                 </div>
//               )}
//             </div>
//           </section>
//         )}

//         {activeTab === "newCompetitions" && (
//           <section>
//             <div className="bg-gradient-to-r from-blue-800 to-blue-900 rounded-xl p-6 text-white mb-6">
//               <h2 className="text-2xl font-bold mb-2">New Writing Competitions</h2>
//               <p className="text-blue-100">Submit your content before the deadline</p>
//             </div>
//             {!isLoading && !error && filteredCompetitions.length === 0 ? (
//               <div className="text-center py-12">
//                 <Trophy className="mx-auto h-12 w-12 text-gray-300 mb-3" />
//                 <h3 className="text-lg font-semibold text-gray-900 mb-2">No competitions found</h3>
//                 <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 {filteredCompetitions.map((competition) => (
//                   <div key={competition.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//                     <div className="p-6">
//                       <div className="flex justify-between items-start mb-3">
//                         <div className="flex-grow">
//                           <h3 className="font-semibold text-gray-900 text-lg mb-1">{competition.title}</h3>
//                           <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
//                             {competition.category}
//                           </span>
//                         </div>
//                         {competition.featured && (
//                           <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
//                             Featured
//                           </span>
//                         )}
//                       </div>
//                       <p className="text-gray-600 text-sm mb-4 line-clamp-3">{competition.description}</p>
//                       <div className="space-y-2 mb-4">
//                         <div className="flex items-center text-sm text-gray-500">
//                           <Trophy className="mr-2 text-yellow-500" size={16} />
//                           <span className="text-yellow-600 font-medium">{competition.prize}</span>
//                         </div>
//                         <div className="flex items-center text-sm text-gray-600">
//                           <Calendar className="mr-2" size={16} />
//                           <span>Deadline: {competition.deadline}</span>
//                         </div>
//                         <div className="flex items-center text-sm text-gray-600">
//                           <Star className="mr-2" size={16} />
//                           <span>
//                             {competition.participants}/{competition.maxParticipants} participants
//                           </span>
//                         </div>
//                       </div>
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center">
//                           <img
//                             src={competition.organizer.avatar}
//                             alt={competition.organizer.name}
//                             className="w-6 h-6 rounded-full object-cover mr-2"
//                           />
//                           <span className="text-xs text-gray-600">{competition.organizer.name}</span>
//                         </div>
//                         <div className="flex space-x-2">
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => openCompetitionDetails(competition)}
//                           >
//                             View Details
//                           </Button>
//                           {!isDeadlinePassed(competition.deadline) && (
//                             <Button
//                               variant="primary"
//                               size="sm"
//                               onClick={() => openSubmissionModal(competition)}
//                               icon={<Send size={14} />}
//                             >
//                               Submit Entry
//                             </Button>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                     <div className="px-6 pb-4">
//                       <div className="w-full bg-gray-200 rounded-full h-2">
//                         <div
//                           className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
//                           style={{ width: `${(competition.participants / competition.maxParticipants) * 100}%` }}
//                         ></div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </section>
//         )}

//         {/* Using the CompetitionSubmission component */}
//         <CompetitionSubmission
//           selectedCompetition={selectedCompetition}
//           showSubmissionModal={showSubmissionModal}
//           setShowSubmissionModal={setShowSubmissionModal}
//           onSubmit={handleNewSubmission}
//           setSelectedCompetition={setSelectedCompetition}
//           setActiveTab={setActiveTab}
//         />

//         {/* Only show competition details modal when submission modal is not visible */}
//         {selectedCompetition && !showSubmissionModal && (
//           <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
//               <div className="p-6">
//                 <div className="flex justify-between items-start mb-4">
//                   <div>
//                     <h3 className="text-xl font-bold mb-2">{selectedCompetition.title}</h3>
//                     <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm font-medium">
//                       {selectedCompetition.category}
//                     </span>
//                   </div>
//                   <button
//                     onClick={() => setSelectedCompetition(null)}
//                     className="text-gray-500 hover:text-gray-700"
//                   >
//                     <X size={24} />
//                   </button>
//                 </div>
//                 <div className="space-y-4">
//                   <div>
//                     <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
//                     <p className="text-gray-600">{selectedCompetition.description}</p>
//                   </div>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <h4 className="font-semibold text-gray-900 mb-2">Prize</h4>
//                       <p className="text-yellow-600 font-medium">{selectedCompetition.prize}</p>
//                     </div>
//                     <div>
//                       <h4 className="font-semibold text-gray-900 mb-2">Deadline</h4>
//                       <p className="text-gray-600">{selectedCompetition.deadline} {isDeadlinePassed(selectedCompetition.deadline) && "(Closed)"}</p>
//                     </div>
//                   </div>
//                   <div>
//                     <h4 className="font-semibold text-gray-900 mb-2">Rules</h4>
//                     <ul className="list-disc list-inside space-y-1 text-gray-600">
//                       {selectedCompetition.rules.map((rule, index) => (
//                         <li key={index}>{rule}</li>
//                       ))}
//                     </ul>
//                   </div>
//                   <div>
//                     <h4 className="font-semibold text-gray-900 mb-2">Judging Criteria</h4>
//                     <ul className="list-disc list-inside space-y-1 text-gray-600">
//                       {selectedCompetition.judgesCriteria.map((criteria, index) => (
//                         <li key={index}>{criteria}</li>
//                       ))}
//                     </ul>
//                   </div>
//                 </div>
//                 <div className="mt-6 flex justify-end space-x-3">
//                   <Button variant="outline" onClick={() => setSelectedCompetition(null)}>
//                     Close
//                   </Button>
//                   {!isDeadlinePassed(selectedCompetition.deadline) && (
//                     <Button
//                       variant="primary"
//                       onClick={() => openSubmissionModal(selectedCompetition)}
//                       icon={<Send size={16} />}
//                     >
//                       Submit Entry
//                     </Button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {showEditModal && editingSubmission && (
//           <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
//               <div className="p-6">
//                 <div className="flex justify-between items-start mb-4">
//                   <div>
//                     <h3 className="text-xl font-bold mb-2">Edit Submission</h3>
//                     <p className="text-gray-600">{editingSubmission.title}</p>
//                   </div>
//                   <button
//                     onClick={() => {
//                       setShowEditModal(false);
//                       setEditingSubmission(null);
//                       setEditForm({ title: "", content: "", wordCount: 0 });
//                       setEditError(null);
//                     }}
//                     className="text-gray-500 hover:text-gray-700"
//                   >
//                     <X size={24} />
//                   </button>
//                 </div>
                
//                 {editError && (
//                   <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
//                     {editError}
//                   </div>
//                 )}
                
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Entry Title
//                     </label>
//                     <input
//                       type="text"
//                       value={editForm.title}
//                       onChange={(e) => handleEditChange("title", e.target.value)}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       placeholder="Enter your submission title..."
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Your Entry
//                     </label>
//                     <Editor
//                       apiKey="bt1w2ivk1v3fqe0n5lkisczo8gbyjwgw0tp7ur75kmuxobvb"
//                       onInit={(evt, editor) => editorRef.current = editor}
//                       initialValue={editForm.content}
//                       value={editForm.content}
//                       onEditorChange={(content) => handleEditChange("content", content)}
//                       init={{
//                         height: 350,
//                         menubar: false,
//                         plugins: [
//                           'advlist', 'autolink', 'lists', 'link', 'charmap', 
//                           'searchreplace', 'visualblocks', 'code', 'fullscreen',
//                           'insertdatetime', 'table', 'wordcount'
//                         ],
//                         toolbar: 'undo redo | formatselect | ' +
//                           'bold italic underline | alignleft aligncenter ' +
//                           'alignright alignjustify | bullist numlist outdent indent | ' +
//                           'fontsize | removeformat | help',
//                         content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
//                         fontsize_formats: '8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt',
//                         branding: false,
//                         resize: false,
//                         statusbar: false
//                       }}
//                     />
//                     <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
//                       <span>Word count: {editForm.wordCount}</span>
//                       <span>Changes will be saved as draft</span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="mt-6 flex justify-end space-x-3">
//                   <Button variant="outline"
//                     onClick={() => {
//                       setShowEditModal(false);
//                       setEditingSubmission(null);
//                       setEditForm({ title: "", content: "", wordCount: 0 });
//                       setEditError(null);
//                     }}
//                   >
//                     Cancel
//                   </Button>
//                   <Button
//                     variant="primary"
//                     onClick={handleEditSubmission}
//                     disabled={!editForm.title || !editForm.content || isEditing}
//                     icon={<Edit size={16} />}
//                   >
//                     {isEditing ? (
//                       <>
//                         <span className="mr-2">Saving...</span>
//                         <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                       </>
//                     ) : "Save Changes"}
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {showContentModal && selectedSubmission && (
//           <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
//               <div className="p-6">
//                 <div className="flex justify-between items-start mb-4">
//                   <div>
//                     <h3 className="text-xl font-bold mb-2">View Submission</h3>
//                     <p className="text-gray-600">{selectedSubmission.title} {selectedSubmission.name && `by ${selectedSubmission.name}`}</p>
//                   </div>
//                   <button
//                     onClick={() => {
//                       setShowContentModal(false);
//                       setSelectedSubmission(null);
//                     }}
//                     className="text-gray-500 hover:text-gray-700"
//                   >
//                     <X size={24} />
//                   </button>
//                 </div>
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
//                     <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 max-h-96 overflow-y-auto">
//                       {/* Use dangerouslySetInnerHTML to render the HTML content */}
//                       <div 
//                         className="text-gray-700 leading-relaxed"
//                         dangerouslySetInnerHTML={{ __html: selectedSubmission.content }} 
//                       />
//                     </div>
//                   </div>
//                   {selectedSubmission.wordCount && (
//                     <div className="text-sm text-gray-500">
//                       Word count: {selectedSubmission.wordCount}
//                     </div>
//                   )}
//                   <div className="flex items-center text-sm font-medium text-gray-700">
//                     <Star size={16} className="mr-1 text-yellow-500" />
//                     Current Votes: {getCurrentVotes(selectedSubmission.competitionId, selectedSubmission.id, selectedSubmission.votes)}
//                   </div>
//                 </div>
//                 <div className="mt-6 flex justify-end space-x-3">
//                   <Button
//                     variant="outline"
//                     onClick={() => {
//                       setShowContentModal(false);
//                       setSelectedSubmission(null);
//                     }}
//                   >
//                     Close
//                   </Button>
//                   {selectedSubmission.userId && selectedSubmission.userId !== mockData.currentUser.id && (
//                     <Button
//                       variant="primary"
//                       onClick={() => handleVote(selectedSubmission.competitionId, selectedSubmission.id)}
//                       icon={<Star size={16} />}
//                     >
//                       {(votes[`${selectedSubmission.competitionId}-${selectedSubmission.id}`] || 0) > 0 ? "Remove Vote" : "Vote"}
//                     </Button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {showDeleteModal && selectedSubmission && (
//           <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-xl max-w-md w-full shadow-2xl">
//               <div className="p-6">
//                 <div className="flex items-center mb-4">
//                   <div className="bg-red-100 p-3 rounded-full mr-4">
//                     <Trash2 className="text-red-600" size={24} />
//                   </div>
//                   <div>
//                     <h3 className="text-lg font-bold text-gray-900">Delete Submission</h3>
//                     <p className="text-gray-600">Are you sure you want to delete this submission?</p>
//                   </div>
//                 </div>
//                 <div className="bg-gray-50 p-4 rounded-lg mb-4">
//                   <h4 className="font-medium text-gray-900">{selectedSubmission.title}</h4>
//                   <p className="text-sm text-gray-600">Status: {selectedSubmission.status}</p>
//                 </div>
                
//                 {deleteError && (
//                   <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
//                     {deleteError}
//                   </div>
//                 )}
                
//                 <p className="text-sm text-red-600 mb-6">This action cannot be undone.</p>
//                 <div className="flex justify-end space-x-3">
//                   <Button
//                     variant="outline"
//                     onClick={() => {
//                       setShowDeleteModal(false);
//                       setSelectedSubmission(null);
//                       setDeleteError(null);
//                     }}
//                   >
//                     Cancel
//                   </Button>
//                   <Button
//                     variant="danger"
//                     onClick={() => handleDeleteSubmission(selectedSubmission.id)}
//                     icon={<Trash2 size={16} />}
//                     disabled={isDeleting}
//                   >
//                     {isDeleting ? (
//                       <>
//                         <span className="mr-2">Deleting...</span>
//                         <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                       </>
//                     ) : "Delete"}
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Competitions;
