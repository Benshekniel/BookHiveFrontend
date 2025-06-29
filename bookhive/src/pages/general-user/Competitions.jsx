import React, { useState } from "react";
import { Trophy, Calendar, Star, Send, Search, Users, FileText, X, Crown } from "lucide-react";

const mockData = {
  currentUser: {
    id: 1,
    name: "Samantha Perera",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  },
  writingCompetitions: [
    {
      id: 1,
      title: "Short Story Championship 2024",
      category: "Writing",
      description: "Unleash your creativity in this premier writing competition...",
      prize: "Rs. 50,000 + Publication",
      deadline: "March 15, 2024",
      featured: true,
      participants: 45,
      maxParticipants: 100,
      organizer: { name: "Literary Society", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" },
      rules: ["Original work only - no plagiarism", "Word limit: 1,500-3,000 words", "Submit in PDF format", "One entry per participant"],
      judgesCriteria: ["Creativity and originality (40%)", "Writing style and technique (30%)", "Character development (20%)", "Overall impact (10%)"],
      submissions: [
        { id: 1, userId: 2, name: "John Doe", title: "Lost Horizons", content: "A tale of a lost traveler finding solace in an ancient forest, where whispers of forgotten legends guide his path...", votes: 72 },
        { id: 2, userId: 3, name: "Jane Smith", title: "Silent Echoes", content: "Echoes of a forgotten past resonate through an abandoned village, revealing secrets buried for centuries...", votes: 60 },
        { id: 3, userId: 1, name: "Samantha Perera", title: "The Journey Home", content: "A journey back to roots uncovers a family legacy hidden beneath the ruins of an old estate...", votes: 85 },
      ],
      leaderboard: [
        { userId: 1, name: "Samantha Perera", votes: 85, submissionTitle: "The Journey Home" },
        { userId: 2, name: "John Doe", votes: 72, submissionTitle: "Lost Horizons" },
        { userId: 3, name: "Jane Smith", votes: 60, submissionTitle: "Silent Echoes" },
      ],
    },
    {
      id: 2,
      title: "Young Writers Challenge 2025",
      category: "Writing",
      description: "A platform for young writers to showcase their skills...",
      prize: "Rs. 15,000 + Mentorship",
      deadline: "July 15, 2025",
      featured: false,
      participants: 28,
      maxParticipants: 75,
      organizer: { name: "Education Foundation", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" },
      rules: ["Age limit: 16-25 years", "Word count: 800-1,200 words", "Topic: 'Future of Writing'", "Include bibliography if citing sources"],
      judgesCriteria: ["Argument strength (40%)", "Evidence and research (25%)", "Writing clarity (20%)", "Originality of perspective (15%)"],
    },
  ],
  userSubmissions: [
    {
      id: 1,
      title: "The Journey Home",
      competitionId: 1,
      status: "Under Review",
      submittedAt: "2024-01-20",
      wordCount: 2450,
      votes: 85,
    },
  ],
};

const Button = ({ children, variant = "primary", size = "md", icon, className = "", onClick, disabled = false, ...props }) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500 disabled:hover:bg-yellow-500",
    secondary: "bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 focus:ring-blue-500",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`} onClick={onClick} disabled={disabled} {...props}>
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "under review":
      return "bg-yellow-100 text-yellow-800";
    case "submitted":
      return "bg-green-100 text-green-800";
    case "active":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const Competitions = () => {
  const [activeTab, setActiveTab] = useState("voting");
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [submissionForm, setSubmissionForm] = useState({
    title: "",
    content: "",
    wordCount: 0,
  });
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showContentModal, setShowContentModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [votes, setVotes] = useState({});

  const { writingCompetitions, userSubmissions } = mockData;

  const handleSubmissionChange = (field, value) => {
    setSubmissionForm((prev) => ({
      ...prev,
      [field]: value,
      wordCount: field === "content" ? value.split(" ").filter((word) => word.length > 0).length : prev.wordCount,
    }));
  };

  const handleSubmitEntry = () => {
    console.log("Submitting entry:", { selectedCompetition, ...submissionForm });
    setShowSubmissionModal(false);
    setSubmissionForm({ title: "", content: "", wordCount: 0 });
    setSelectedCompetition(null);
  };

  const handleVote = (competitionId, submissionId) => {
    setVotes((prev) => ({
      ...prev,
      [`${competitionId}-${submissionId}`]: (prev[`${competitionId}-${submissionId}`] || 0) + 1,
    }));
    setShowContentModal(false);
  };

  const isDeadlinePassed = (deadline) => {
    const deadlineDate = new Date(deadline);
    const currentDate = new Date("2025-06-27");
    return deadlineDate < currentDate;
  };

  const filteredCompetitions = writingCompetitions.filter((competition) => {
    const matchesSearch =
      competition.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      competition.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || competition.category === selectedCategory;
    const matchesStatus =
      !selectedStatus ||
      (selectedStatus === "Active" && !isDeadlinePassed(competition.deadline) && competition.participants < competition.maxParticipants) ||
      (selectedStatus === "Ending Soon" && competition.featured && !isDeadlinePassed(competition.deadline));
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const pastCompetitions = writingCompetitions.filter((competition) => isDeadlinePassed(competition.deadline));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-4 border-b border-gray-200">
            <button
              className={`pb-2 px-4 ${activeTab === "voting" ? "border-b-2 border-yellow-500 text-yellow-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("voting")}
            >
              Voting
            </button>
            <button
              className={`pb-2 px-4 ${activeTab === "newCompetitions" ? "border-b-2 border-yellow-500 text-yellow-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("newCompetitions")}
            >
              New Competitions
            </button>
            <button
              className={`pb-2 px-4 ${activeTab === "yourSubmissions" ? "border-b-2 border-yellow-500 text-yellow-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("yourSubmissions")}
            >
              Your Submissions
            </button>
          </div>
        </div>

        {/* Voting Tab */}
        {activeTab === "voting" && (
          <section>
            <div className="bg-gradient-to-r from-blue-800 to-blue-900 rounded-xl p-6 text-white mb-6">
              <h2 className="text-2xl font-bold mb-2">Voting for Past Writing Competitions</h2>
              <p className="text-blue-100">Cast your votes and view the leaderboard</p>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {pastCompetitions.length > 0 ? (
                pastCompetitions.map((competition) => (
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
                      {competition.submissions && (
                        <div className="space-y-4 mb-6">
                          <h4 className="font-semibold text-gray-900 text-lg mb-2">Competitor Submissions</h4>
                          {competition.submissions
                            .filter((s) => s.userId !== mockData.currentUser.id)
                            .map((submission) => {
                              const currentVotes = votes[`${competition.id}-${submission.id}`] || submission.votes;
                              return (
                                <div key={submission.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition">
                                  <h5 className="font-medium text-gray-900">{submission.title} by {submission.name}</h5>
                                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{submission.content.substring(0, 50)}...</p>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedSubmission({ ...submission, competitionId: competition.id });
                                      setShowContentModal(true);
                                    }}
                                  >
                                    View Content
                                  </Button>
                                </div>
                              );
                            })}
                        </div>
                      )}
                      {competition.leaderboard && (
                        <div className="mt-6">
                          <h4 className="font-semibold text-gray-900 text-lg mb-4">Leaderboard</h4>
                          <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-4 rounded-lg shadow-inner">
                            {competition.leaderboard.map((entry, index) => {
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
                                    <span className={`font-bold ${index < 3 ? "text-xl" : "text-lg"} ${
                                      isCurrentUser ? "text-blue-600" : "text-gray-800"
                                    }`}>
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
                              const currentVotes = votes[`${competition.id}-${submission.id}`] || submission.votes;
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
                ))
              ) : (
                <div className="text-center py-12">
                  <Trophy className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No past competitions available for voting</h3>
                </div>
              )}
            </div>
          </section>
        )}

        {activeTab === "newCompetitions" && (
          <section>
            <div className="bg-gradient-to-r from-blue-800 to-blue-900 rounded-xl p-6 text-white mb-6">
              <h2 className="text-2xl font-bold mb-2">New Writing Competitions</h2>
              <p className="text-blue-100">Submit your content before the deadline</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredCompetitions.map((competition) => (
                <div key={competition.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-grow">
                        <h3 className="font-semibold text-gray-900 text-lg mb-1">{competition.title}</h3>
                        <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                          {competition.category}
                        </span>
                      </div>
                      {competition.featured && (
                        <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{competition.description}</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Trophy className="mr-2 text-yellow-500" size={16} />
                        <span className="text-yellow-600 font-medium">{competition.prize}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="mr-2" size={16} />
                        <span>Deadline: {competition.deadline}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Star className="mr-2" size={16} />
                        <span>
                          {competition.participants}/{competition.maxParticipants} participants
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img
                          src={competition.organizer.avatar}
                          alt={competition.organizer.name}
                          className="w-6 h-6 rounded-full object-cover mr-2"
                        />
                        <span className="text-xs text-gray-600">{competition.organizer.name}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedCompetition(competition)}
                        >
                          View Details
                        </Button>
                        {!isDeadlinePassed(competition.deadline) && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => {
                              setSelectedCompetition(competition);
                              setShowSubmissionModal(true);
                            }}
                            icon={<Send size={14} />}
                          >
                            Submit Entry
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="px-6 pb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(competition.participants / competition.maxParticipants) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {filteredCompetitions.length === 0 && (
              <div className="text-center py-12">
                <Trophy className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No competitions found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </section>
        )}

        {activeTab === "yourSubmissions" && (
          <section>
            <div className="bg-gradient-to-r from-blue-800 to-blue-900 rounded-xl p-6 text-white mb-6">
              <h2 className="text-2xl font-bold mb-2">Your Writing Submissions</h2>
              <p className="text-blue-100">Track your submitted entries</p>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {userSubmissions.length > 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-6">
                    {userSubmissions.map((submission) => {
                      const competition = writingCompetitions.find((c) => c.id === submission.competitionId);
                      return (
                        <div
                          key={submission.id}
                          className="p-6 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition mb-4"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-grow">
                              <h3 className="font-semibold text-gray-900 text-lg mb-1">{submission.title}</h3>
                              <p className="text-sm text-gray-600">{competition?.title}</p>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm mb-4">
                            Submitted: {submission.submittedAt} •{" "}
                            {submission.wordCount > 0 ? `${submission.wordCount} words` : "Writing submission"}
                          </p>
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              submission.status
                            )}`}
                          >
                            {submission.status}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No submissions yet</h3>
                  <p className="text-gray-500">Submit an entry in the New Competitions tab to get started.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Competition Details Modal */}
        {selectedCompetition && !showSubmissionModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{selectedCompetition.title}</h3>
                    <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm font-medium">
                      {selectedCompetition.category}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedCompetition(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                    <p className="text-gray-600">{selectedCompetition.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Prize</h4>
                      <p className="text-yellow-600 font-medium">{selectedCompetition.prize}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Deadline</h4>
                      <p className="text-gray-600">{selectedCompetition.deadline} {isDeadlinePassed(selectedCompetition.deadline) && "(Closed)"}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Rules</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      {selectedCompetition.rules.map((rule, index) => (
                        <li key={index}>{rule}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Judging Criteria</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      {selectedCompetition.judgesCriteria.map((criteria, index) => (
                        <li key={index}>{criteria}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <Button variant="outline" onClick={() => setSelectedCompetition(null)}>
                    Close
                  </Button>
                  {!isDeadlinePassed(selectedCompetition.deadline) && (
                    <Button
                      variant="primary"
                      onClick={() => setShowSubmissionModal(true)}
                      icon={<Send size={16} />}
                    >
                      Submit Entry
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submission Modal */}
        {showSubmissionModal && selectedCompetition && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Submit Entry</h3>
                    <p className="text-gray-600">{selectedCompetition.title}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowSubmissionModal(false);
                      setSubmissionForm({ title: "", content: "", wordCount: 0 });
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Entry Title
                    </label>
                    <input
                      type="text"
                      value={submissionForm.title}
                      onChange={(e) => handleSubmissionChange("title", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your submission title..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Entry
                    </label>
                    <textarea
                      rows={12}
                      value={submissionForm.content}
                      onChange={(e) => handleSubmissionChange("content", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Write your entry here..."
                    />
                    <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                      <span>Word count: {submissionForm.wordCount}</span>
                      <span>Remember to follow the competition rules</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowSubmissionModal(false);
                      setSubmissionForm({ title: "", content: "", wordCount: 0 });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSubmitEntry}
                    disabled={!submissionForm.title || !submissionForm.content || isDeadlinePassed(selectedCompetition.deadline)}
                    icon={<Send size={16} />}
                  >
                    Submit Entry
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content View Modal */}
        {showContentModal && selectedSubmission && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">View Submission</h3>
                    <p className="text-gray-600">{selectedSubmission.title} by {selectedSubmission.name}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowContentModal(false);
                      setSelectedSubmission(null);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedSubmission.content}</p>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowContentModal(false);
                      setSelectedSubmission(null);
                    }}
                  >
                    Close
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => handleVote(selectedSubmission.competitionId, selectedSubmission.id)}
                    disabled={selectedSubmission.userId === mockData.currentUser.id}
                    icon={<Star size={16} />}
                  >
                    Vote
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

export default Competitions;