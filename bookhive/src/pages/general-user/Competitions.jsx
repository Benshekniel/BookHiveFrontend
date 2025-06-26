import React, { useState } from "react";
import {
  Trophy,
  Calendar,
  Star,
  Send,
  Search,
  Users,
  FileText,
  X,
} from "lucide-react";

// Mock data - replace with your actual data source
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
      category: "Short Story",
      description:
        "Unleash your creativity in this premier short story competition. Write compelling narratives that captivate readers and showcase your storytelling prowess. Open to all skill levels.",
      prize: "Rs. 50,000 + Publication",
      deadline: "March 15, 2024",
      featured: true,
      participants: 45,
      maxParticipants: 100,
      organizer: {
        name: "Literary Society",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      },
      rules: [
        "Original work only - no plagiarism",
        "Word limit: 1,500-3,000 words",
        "Submit in PDF format",
        "One entry per participant",
      ],
      judgesCriteria: [
        "Creativity and originality (40%)",
        "Writing style and technique (30%)",
        "Character development (20%)",
        "Overall impact (10%)",
      ],
    },
    {
      id: 2,
      title: "Poetry Contest - Love & Loss",
      category: "Poetry",
      description:
        "Express the depths of human emotion through verse. This poetry competition celebrates the timeless themes of love and loss, inviting poets to share their most heartfelt creations.",
      prize: "Rs. 25,000 + Featured Publication",
      deadline: "February 28, 2024",
      featured: true,
      participants: 32,
      maxParticipants: 50,
      organizer: {
        name: "Poets Guild",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
      },
      rules: [
        "Maximum 3 poems per submission",
        "Each poem: 14-40 lines",
        "English or Sinhala accepted",
        "Previously unpublished work only",
      ],
      judgesCriteria: [
        "Emotional resonance (35%)",
        "Technical skill (25%)",
        "Imagery and metaphor (25%)",
        "Originality (15%)",
      ],
    },
    {
      id: 3,
      title: "Young Writers Essay Challenge",
      category: "Essay",
      description:
        "A platform for emerging voices to share their perspectives on contemporary issues. This essay competition encourages thoughtful analysis and persuasive writing.",
      prize: "Rs. 15,000 + Mentorship",
      deadline: "April 10, 2024",
      featured: false,
      participants: 28,
      maxParticipants: 75,
      organizer: {
        name: "Education Foundation",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      },
      rules: [
        "Age limit: 16-25 years",
        "Word count: 800-1,200 words",
        "Topic: 'Technology and Human Connection'",
        "Include bibliography if citing sources",
      ],
      judgesCriteria: [
        "Argument strength (40%)",
        "Evidence and research (25%)",
        "Writing clarity (20%)",
        "Originality of perspective (15%)",
      ],
    },
    {
      id: 4,
      title: "Book Review Competition",
      category: "Review",
      description:
        "Share your insights on contemporary literature. This competition celebrates critical thinking and analytical writing through thoughtful book reviews.",
      prize: "Rs. 10,000 + Book Vouchers",
      deadline: "March 30, 2024",
      featured: false,
      participants: 19,
      maxParticipants: 60,
      organizer: {
        name: "Book Critics Circle",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
      },
      rules: [
        "Review books published in 2023-2024",
        "Word limit: 500-1,000 words",
        "Include book details and rating",
        "Avoid major spoilers",
      ],
      judgesCriteria: [
        "Critical analysis (35%)",
        "Writing quality (30%)",
        "Insight and perspective (25%)",
        "Engagement factor (10%)",
      ],
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
    },
    {
      id: 2,
      title: "Whispers of the Heart",
      competitionId: 2,
      status: "Submitted",
      submittedAt: "2024-01-18",
      wordCount: 0,
    },
  ],
};

const Button = ({ children, variant = "primary", size = "md", icon, className = "", onClick, disabled = false, ...props }) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

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
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
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
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [submissionForm, setSubmissionForm] = useState({
    title: "",
    content: "",
    wordCount: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const { currentUser, writingCompetitions, userSubmissions } = mockData;

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

  const filteredCompetitions = writingCompetitions.filter((competition) => {
    const matchesSearch =
      competition.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      competition.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || competition.category === selectedCategory;
    const matchesStatus =
      !selectedStatus ||
      (selectedStatus === "Active" && competition.participants < competition.maxParticipants) ||
      (selectedStatus === "Ending Soon" && competition.featured);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-900 rounded-xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Writing Competitions</h2>
          <p className="text-blue-100 mb-4">Showcase your writing talent and win exciting prizes</p>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <Trophy className="mr-2" size={16} />
              <span>{writingCompetitions.length} Active Competitions</span>
            </div>
            <div className="flex items-center">
              <Users className="mr-2" size={16} />
              <span>{userSubmissions.length} Your Submissions</span>
            </div>
          </div>
        </div>

        {/* Filter and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search competitions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              <option value="Short Story">Short Story</option>
              <option value="Essay">Essay</option>
              <option value="Poetry">Poetry</option>
              <option value="Review">Review</option>
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Ending Soon">Ending Soon</option>
            </select>
          </div>
        </div>

        {/* Your Submissions */}
        {userSubmissions.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-semibold text-xl flex items-center">
                <FileText className="mr-2 text-gray-600" size={18} />
                Your Submissions
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {userSubmissions.map((submission) => {
                  const competition = writingCompetitions.find((c) => c.id === submission.competitionId);
                  return (
                    <div
                      key={submission.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{submission.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{competition?.title}</p>
                        <p className="text-xs text-gray-500">
                          Submitted: {submission.submittedAt} •{" "}
                          {submission.wordCount > 0 ? `${submission.wordCount} words` : "Poetry submission"}
                        </p>
                      </div>
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
          </div>
        )}

        {/* Active Competitions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCompetitions.map((competition) => (
            <div
              key={competition.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
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
                      <p className="text-gray-600">{selectedCompetition.deadline}</p>
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
                  <Button
                    variant="primary"
                    onClick={() => setShowSubmissionModal(true)}
                    icon={<Send size={16} />}
                  >
                    Submit Entry
                  </Button>
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
                    disabled={!submissionForm.title || !submissionForm.content}
                    icon={<Send size={16} />}
                  >
                    Submit Entry
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