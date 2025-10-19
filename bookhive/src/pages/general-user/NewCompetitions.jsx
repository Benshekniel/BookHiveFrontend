import React, { useState, useEffect } from "react";
import { Trophy, Calendar, Star, Send, Search, X, Book, LogOut } from "lucide-react";
import axios from "axios";
import { useTrustScore } from '../../components/TrustScoreContext';
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

const NewCompetitions = ({ competitions, openSubmissionModal, onJoinSuccess }) => {
  const { trustScore, isLoading: trustScoreLoading } = useTrustScore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [participationStatus, setParticipationStatus] = useState({});
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [userCompetitions, setUserCompetitions] = useState([]);
  const [updatedCompetitions, setUpdatedCompetitions] = useState(competitions);
  const baseUrl = "http://localhost:9090";
  const userEmail = "user@gmail.com"; // Replace with authenticated user's email

  // Debug competitions prop
  useEffect(() => {
    console.log("Competitions prop:", competitions);
  }, [competitions]);

  // Update local competitions state when prop changes
  useEffect(() => {
    setUpdatedCompetitions(competitions);
  }, [competitions]);

  // Fetch competitions the user is participating in
  useEffect(() => {
    const fetchUserCompetitions = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/participating/${userEmail}`);
        setUserCompetitions(response.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch user competitions");
      }
    };
    fetchUserCompetitions();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "Not set";
    const date = new Date(dateStr);
    // Adjust for +0530 timezone
    date.setHours(date.getHours() + 5);
    date.setMinutes(date.getMinutes() + 30);
    return isNaN(date.getTime()) ? "Not set" : date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  };

  const filteredCompetitions = updatedCompetitions.filter((competition) => {
    const matchesSearch =
      competition.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      competition.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || competition.category === selectedCategory;
    const startDate = new Date(competition.startDatetime);
    const endDate = new Date(competition.endDatetime);
    const votingEndDate = new Date(competition.votingEndDatetime);
    const currentDate = new Date();
    const isJoinable = currentDate >= startDate && currentDate <= endDate;
    const isOngoing = currentDate > endDate && currentDate < votingEndDate;
    const matchesStatus =
      !selectedStatus ||
      (selectedStatus === "Active" && isJoinable && (competition.currentparticipants || 0) < competition.maxParticipants) ||
      (selectedStatus === "Ending Soon" && competition.featured && isJoinable) ||
      (selectedStatus === "Ongoing" && isOngoing);
    return matchesSearch && matchesCategory && matchesStatus && (isJoinable || isOngoing);
  });

  const handleParticipate = async (competitionId) => {
    setIsLoading(true);
    setError(null);
    setParticipationStatus((prev) => ({ ...prev, [competitionId]: { loading: true, error: null, success: false } }));

    try {
      const response = await axios.post(
        `${baseUrl}/api/joinCompetition`,
        null,
        {
          params: { competitionId, email: userEmail },
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const result = response.data;
      if (result.message === "User joined competition successfully.") {
        setParticipationStatus((prev) => ({
          ...prev,
          [competitionId]: { loading: false, success: true, error: null },
        }));
        setUserCompetitions((prev) => [...prev, competitionId]);
        // Update currentparticipants locally
        setUpdatedCompetitions((prev) =>
          prev.map((comp) =>
            comp.id === competitionId
              ? { ...comp, currentparticipants: (comp.currentparticipants || 0) + 1 }
              : comp
          )
        );
        onJoinSuccess(competitionId);
      } else {
        setParticipationStatus((prev) => ({
          ...prev,
          [competitionId]: { loading: false, success: false, error: result.message || "Failed to join competition" },
        }));
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setParticipationStatus((prev) => ({
        ...prev,
        [competitionId]: { loading: false, success: false, error: errorMessage },
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeaveCompetition = async (competitionId) => {
    setIsLoading(true);
    setError(null);
    setParticipationStatus((prev) => ({ ...prev, [competitionId]: { loading: true, error: null, success: false } }));

    try {
      const response = await axios.post(
        `${baseUrl}/api/leaveCompetition`,
        null,
        {
          params: { competitionId, email: userEmail },
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const result = response.data;
      if (result.message === "User left competition successfully.") {
        setParticipationStatus((prev) => ({
          ...prev,
          [competitionId]: { loading: false, success: false, error: null, left: true },
        }));
        setUserCompetitions((prev) => prev.filter((id) => id !== competitionId));
        // Update currentparticipants locally
        setUpdatedCompetitions((prev) =>
          prev.map((comp) =>
            comp.id === competitionId
              ? { ...comp, currentparticipants: Math.max((comp.currentparticipants || 0) - 1, 0) }
              : comp
          )
        );
        onJoinSuccess(competitionId);
      } else {
        setParticipationStatus((prev) => ({
          ...prev,
          [competitionId]: { loading: false, success: false, error: result.message || "Failed to leave competition" },
        }));
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setParticipationStatus((prev) => ({
        ...prev,
        [competitionId]: { loading: false, success: false, error: errorMessage },
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const openDetailsModal = (competition) => {
    setSelectedCompetition(competition);
    setShowDetailsModal(true);
  };

  return (
    <section>
      <div className="bg-gradient-to-r from-blue-800 to-blue-900 rounded-xl p-6 text-white mb-6">
        <h2 className="text-2xl font-bold mb-2">New Writing Competitions</h2>
        <p className="text-blue-100">Submit your content before the deadline</p>
      </div>
      <div className="mb-6 flex space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search competitions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          <option value="Fantasy">Fantasy</option>
          <option value="Open">Open</option>
          <option value="Mystery">Mystery</option>
        </select>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Ending Soon">Ending Soon</option>
          <option value="Ongoing">Ongoing</option>
        </select>
      </div>
      {isLoading || trustScoreLoading ? (
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      ) : error ? (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      ) : filteredCompetitions.length === 0 ? (
        <div className="text-center py-12">
          <Trophy className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No competitions found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCompetitions.map((competition) => {
            const startDate = new Date(competition.startDatetime);
            const endDate = new Date(competition.endDatetime);
            const votingEndDate = new Date(competition.votingEndDatetime);
            const currentDate = new Date();
            const isJoinable = currentDate >= startDate && currentDate <= endDate;
            const isOngoing = currentDate > endDate && currentDate < votingEndDate;
            const trustScoreShortfall = competition.trustScoreRequirement - trustScore;
            const hasParticipated = userCompetitions.includes(competition.id);
            let actionButton;

            if (isOngoing) {
              actionButton = (
                <NewButton variant="outline" size="sm" disabled>
                  Ongoing
                </NewButton>
              );
            } else if (isJoinable) {
              if (hasParticipated) {
                actionButton = (
                  <NewButton
                    variant="danger"
                    size="sm"
                    onClick={() => handleLeaveCompetition(competition.id)}
                    icon={<LogOut size={14} />}
                    disabled={participationStatus[competition.id]?.loading}
                  >
                    {participationStatus[competition.id]?.loading ? "Leaving..." : "Leave Competition"}
                  </NewButton>
                );
              } else if (trustScore < competition.trustScoreRequirement) {
                actionButton = (
                  <div className="relative group">
                    <NewButton variant="danger" size="sm" disabled>
                      Trustscore not enough
                    </NewButton>
                    <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                      You need {trustScoreShortfall} more trust score points to participate.
                    </div>
                  </div>
                );
              } else if ((competition.currentparticipants || 0) >= competition.maxParticipants) {
                actionButton = (
                  <NewButton variant="danger" size="sm" disabled>
                    Participants are full
                  </NewButton>
                );
              } else {
                actionButton = (
                  <NewButton
                    variant="success"
                    size="sm"
                    onClick={() => handleParticipate(competition.id)}
                    icon={<Send size={14} />}
                    disabled={participationStatus[competition.id]?.loading || participationStatus[competition.id]?.success}
                  >
                    {participationStatus[competition.id]?.loading
                      ? "Joining..."
                      : participationStatus[competition.id]?.success
                      ? "Joined"
                      : "Join Competition"}
                  </NewButton>
                );
              }
            }

            return (
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
                      <span className="text-yellow-600 font-medium">Trustscore Increment: {competition.prize}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="mr-2" size={16} />
                      <span>Participation Deadline: {formatDate(competition.endDatetime)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="mr-2" size={16} />
                      <span>Voting Deadline: {formatDate(competition.votingEndDatetime)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="mr-2" size={16} />
                      <span>{`${competition.currentparticipants || 0}/${competition.maxParticipants} participants`}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="mr-2" size={16} />
                      <span>Trust Score Required: {competition.trustScoreRequirement}</span>
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
                      <NewButton
                        variant="outline"
                        size="sm"
                        onClick={() => openDetailsModal(competition)}
                        icon={<Book size={14} />}
                      >
                        View Details
                      </NewButton>
                      {actionButton}
                    </div>
                  </div>
                  {participationStatus[competition.id]?.error && (
                    <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                      {participationStatus[competition.id].error}
                    </div>
                  )}
                  {participationStatus[competition.id]?.success && (
                    <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
                      You have successfully joined the competition!
                    </div>
                  )}
                  {participationStatus[competition.id]?.left && (
                    <div className="mt-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg text-sm">
                      You have successfully left the competition!
                    </div>
                  )}
                </div>
                <div className="px-6 pb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((competition.currentparticipants || 0) / competition.maxParticipants) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showDetailsModal && selectedCompetition && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <Book className="text-blue-600 mr-3" size={24} />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedCompetition.title}</h3>
                    <p className="text-gray-600">{selectedCompetition.category}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedCompetition(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-700">{selectedCompetition.description}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Rules</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {selectedCompetition.rules.map((rule, index) => (
                      <li key={index}>{rule}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Judging Criteria</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {selectedCompetition.judgesCriteria.map((criterion, index) => (
                      <li key={index}>{criterion}</li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Trophy className="mr-2 text-yellow-500" size={16} />
                    <span>Trustscore Increment: {selectedCompetition.prize}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="mr-2" size={16} />
                    <span>Start Date: {formatDate(selectedCompetition.startDatetime)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="mr-2" size={16} />
                    <span>Participation Deadline: {formatDate(selectedCompetition.endDatetime)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="mr-2" size={16} />
                    <span>Voting Deadline: {formatDate(selectedCompetition.votingEndDatetime)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="mr-2" size={16} />
                    <span>{`${selectedCompetition.currentparticipants || 0}/${selectedCompetition.maxParticipants} participants`}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="mr-2" size={16} />
                    <span>Trust Score Required: {selectedCompetition.trustScoreRequirement}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="mr-2" size={16} />
                    <span>Created By: {selectedCompetition.organizer.name}</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <NewButton
                  variant="outline"
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedCompetition(null);
                  }}
                >
                  Close
                </NewButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

NewCompetitions.propTypes = {
  competitions: PropTypes.array.isRequired,
  openSubmissionModal: PropTypes.func.isRequired,
  onJoinSuccess: PropTypes.func.isRequired,
};

export default NewCompetitions;


// import React, { useState, useEffect } from "react";
// import { Trophy, Calendar, Star, Send, Search, X, Book, LogOut } from "lucide-react";
// import axios from "axios";
// import { useTrustScore } from '../../components/TrustScoreContext';
// import PropTypes from "prop-types";

// // Inline NewButton Component
// const NewButton = ({ variant = "primary", size = "md", children, icon, disabled, onClick, ...props }) => {
//   const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  
//   const variantStyles = {
//     primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
//     outline: "bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
//     success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
//     danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
//   };

//   const sizeStyles = {
//     sm: "px-3 py-1.5 text-sm",
//     md: "px-4 py-2 text-base",
//   };

//   const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";

//   const className = `${baseStyles} ${variantStyles[variant] || variantStyles.primary} ${sizeStyles[size] || sizeStyles.md} ${disabledStyles}`;

//   return (
//     <button
//       className={className}
//       onClick={onClick}
//       disabled={disabled}
//       {...props}
//     >
//       {icon && <span className="mr-2">{icon}</span>}
//       {children}
//     </button>
//   );
// };

// NewButton.propTypes = {
//   variant: PropTypes.oneOf(["primary", "outline", "success", "danger"]),
//   size: PropTypes.oneOf(["sm", "md"]),
//   children: PropTypes.node.isRequired,
//   icon: PropTypes.node,
//   disabled: PropTypes.bool,
//   onClick: PropTypes.func,
// };

// const NewCompetitions = ({ competitions, openSubmissionModal, onJoinSuccess }) => {
//   const { trustScore, isLoading: trustScoreLoading } = useTrustScore();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [selectedStatus, setSelectedStatus] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [participationStatus, setParticipationStatus] = useState({});
//   const [selectedCompetition, setSelectedCompetition] = useState(null);
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
//   const [userCompetitions, setUserCompetitions] = useState([]);
//   const baseUrl = "http://localhost:9090";
//   const userEmail = "user@example.com"; // Replace with authenticated user's email

//   const formatDate = (dateStr) => {
//     if (!dateStr) return "Not set";
//     const date = new Date(dateStr);
//     return isNaN(date.getTime()) ? "Not set" : date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
//   };

//   // Fetch competitions the user is participating in
//   useEffect(() => {
//     const fetchUserCompetitions = async () => {
//       try {
//         const response = await axios.get(`${baseUrl}/api/participating/${userEmail}`);
//         setUserCompetitions(response.data || []);
//       } catch (err) {
//         setError(err.response?.data?.message || "Failed to fetch user competitions");
//       }
//     };
//     fetchUserCompetitions();
//   }, []);

//   const filteredCompetitions = competitions.filter((competition) => {
//     const matchesSearch =
//       competition.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       competition.description.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesCategory = !selectedCategory || competition.category === selectedCategory;
//     const startDate = new Date(competition.startDatetime);
//     const endDate = new Date(competition.endDatetime);
//     const votingEndDate = new Date(competition.votingEndDatetime);
//     const currentDate = new Date();
//     const isJoinable = currentDate >= startDate && currentDate <= endDate;
//     const isOngoing = currentDate > endDate && currentDate < votingEndDate;
//     const matchesStatus =
//       !selectedStatus ||
//       (selectedStatus === "Active" && isJoinable && competition.currentparticipants < competition.maxParticipants) ||
//       (selectedStatus === "Ending Soon" && competition.featured && isJoinable) ||
//       (selectedStatus === "Ongoing" && isOngoing);
//     return matchesSearch && matchesCategory && matchesStatus && (isJoinable || isOngoing);
//   });

//   const handleParticipate = async (competitionId) => {
//     setIsLoading(true);
//     setError(null);
//     setParticipationStatus((prev) => ({ ...prev, [competitionId]: { loading: true, error: null, success: false } }));

//     try {
//       const response = await axios.post(
//         `${baseUrl}/api/joinCompetition`,
//         null,
//         {
//           params: { competitionId, email: userEmail },
//           headers: { 'Content-Type': 'application/json' },
//         }
//       );

//       const result = response.data;
//       if (result.message === "User joined competition successfully.") {
//         setParticipationStatus((prev) => ({
//           ...prev,
//           [competitionId]: { loading: false, success: true, error: null },
//         }));
//         setUserCompetitions((prev) => [...prev, competitionId]);
//         onJoinSuccess(competitionId);
//       } else {
//         setParticipationStatus((prev) => ({
//           ...prev,
//           [competitionId]: { loading: false, success: false, error: result.message || "Failed to join competition" },
//         }));
//       }
//     } catch (err) {
//       const errorMessage = err.response?.data?.message || err.message;
//       setParticipationStatus((prev) => ({
//         ...prev,
//         [competitionId]: { loading: false, success: false, error: errorMessage },
//       }));
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleLeaveCompetition = async (competitionId) => {
//     setIsLoading(true);
//     setError(null);
//     setParticipationStatus((prev) => ({ ...prev, [competitionId]: { loading: true, error: null, success: false } }));

//     try {
//       const response = await axios.post(
//         `${baseUrl}/api/leaveCompetition`,
//         null,
//         {
//           params: { competitionId, email: userEmail },
//           headers: { 'Content-Type': 'application/json' },
//         }
//       );

//       const result = response.data;
//       if (result.message === "User left competition successfully.") {
//         setParticipationStatus((prev) => ({
//           ...prev,
//           [competitionId]: { loading: false, success: false, error: null, left: true },
//         }));
//         setUserCompetitions((prev) => prev.filter((id) => id !== competitionId));
//         onJoinSuccess(competitionId);
//       } else {
//         setParticipationStatus((prev) => ({
//           ...prev,
//           [competitionId]: { loading: false, success: false, error: result.message || "Failed to leave competition" },
//         }));
//       }
//     } catch (err) {
//       const errorMessage = err.response?.data?.message || err.message;
//       setParticipationStatus((prev) => ({
//         ...prev,
//         [competitionId]: { loading: false, success: false, error: errorMessage },
//       }));
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const openDetailsModal = (competition) => {
//     setSelectedCompetition(competition);
//     setShowDetailsModal(true);
//   };

//   return (
//     <section>
//       <div className="bg-gradient-to-r from-blue-800 to-blue-900 rounded-xl p-6 text-white mb-6">
//         <h2 className="text-2xl font-bold mb-2">New Writing Competitions</h2>
//         <p className="text-blue-100">Submit your content before the deadline</p>
//       </div>
//       <div className="mb-6 flex space-x-4">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//           <input
//             type="text"
//             placeholder="Search competitions..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//         <select
//           value={selectedCategory}
//           onChange={(e) => setSelectedCategory(e.target.value)}
//           className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           <option value="">All Categories</option>
//           <option value="Fantasy">Fantasy</option>
//           <option value="Open">Open</option>
//           <option value="Mystery">Mystery</option>
//         </select>
//         <select
//           value={selectedStatus}
//           onChange={(e) => setSelectedStatus(e.target.value)}
//           className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           <option value="">All Statuses</option>
//           <option value="Active">Active</option>
//           <option value="Ending Soon">Ending Soon</option>
//           <option value="Ongoing">Ongoing</option>
//         </select>
//       </div>
//       {isLoading || trustScoreLoading ? (
//         <div className="flex items-center justify-center">
//           <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//           <span className="ml-2 text-gray-600">Loading...</span>
//         </div>
//       ) : error ? (
//         <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
//           {error}
//         </div>
//       ) : filteredCompetitions.length === 0 ? (
//         <div className="text-center py-12">
//           <Trophy className="mx-auto h-12 w-12 text-gray-300 mb-3" />
//           <h3 className="text-lg font-semibold text-gray-900 mb-2">No competitions found</h3>
//           <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {filteredCompetitions.map((competition) => {
//             const startDate = new Date(competition.startDatetime);
//             const endDate = new Date(competition.endDatetime);
//             const votingEndDate = new Date(competition.votingEndDatetime);
//             const currentDate = new Date();
//             const isJoinable = currentDate >= startDate && currentDate <= endDate;
//             const isOngoing = currentDate > endDate && currentDate < votingEndDate;
//             const trustScoreShortfall = competition.trustScoreRequirement - trustScore;
//             const hasParticipated = userCompetitions.includes(competition.id);
//             let actionButton;

//             if (isOngoing) {
//               actionButton = (
//                 <NewButton variant="outline" size="sm" disabled>
//                   Ongoing
//                 </NewButton>
//               );
//             } else if (isJoinable) {
//               if (hasParticipated) {
//                 actionButton = (
//                   <NewButton
//                     variant="danger"
//                     size="sm"
//                     onClick={() => handleLeaveCompetition(competition.id)}
//                     icon={<LogOut size={14} />}
//                     disabled={participationStatus[competition.id]?.loading}
//                   >
//                     {participationStatus[competition.id]?.loading ? "Leaving..." : "Leave Competition"}
//                   </NewButton>
//                 );
//               } else if (trustScore < competition.trustScoreRequirement) {
//                 actionButton = (
//                   <div className="relative group">
//                     <NewButton variant="danger" size="sm" disabled>
//                       Trustscore not enough
//                     </NewButton>
//                     <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
//                       You need {trustScoreShortfall} more trust score points to participate.
//                     </div>
//                   </div>
//                 );
//               } else if (competition.currentparticipants >= competition.maxParticipants) {
//                 actionButton = (
//                   <NewButton variant="danger" size="sm" disabled>
//                     Participants are full
//                   </NewButton>
//                 );
//               } else {
//                 actionButton = (
//                   <NewButton
//                     variant="success"
//                     size="sm"
//                     onClick={() => handleParticipate(competition.id)}
//                     icon={<Send size={14} />}
//                     disabled={participationStatus[competition.id]?.loading || participationStatus[competition.id]?.success}
//                   >
//                     {participationStatus[competition.id]?.loading
//                       ? "Joining..."
//                       : participationStatus[competition.id]?.success
//                       ? "Joined"
//                       : "Join Competition"}
//                   </NewButton>
//                 );
//               }
//             }

//             return (
//               <div key={competition.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//                 <div className="p-6">
//                   <div className="flex justify-between items-start mb-3">
//                     <div className="flex-grow">
//                       <h3 className="font-semibold text-gray-900 text-lg mb-1">{competition.title}</h3>
//                       <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
//                         {competition.category}
//                       </span>
//                     </div>
//                     {competition.featured && (
//                       <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
//                         Featured
//                       </span>
//                     )}
//                   </div>
//                   <p className="text-gray-600 text-sm mb-4 line-clamp-3">{competition.description}</p>
//                   <div className="space-y-2 mb-4">
//                     <div className="flex items-center text-sm text-gray-500">
//                       <Trophy className="mr-2 text-yellow-500" size={16} />
//                       <span className="text-yellow-600 font-medium">{competition.prize}</span>
//                     </div>
//                     <div className="flex items-center text-sm text-gray-600">
//                       <Calendar className="mr-2" size={16} />
//                       <span>Participation Deadline: {formatDate(competition.endDatetime)}</span>
//                     </div>
//                     <div className="flex items-center text-sm text-gray-600">
//                       <Calendar className="mr-2" size={16} />
//                       <span>Voting Deadline: {formatDate(competition.votingEndDatetime)}</span>
//                     </div>
//                     <div className="flex items-center text-sm text-gray-600">
//                       <Star className="mr-2" size={16} />
//                       <span>{`${competition.currentparticipants}/${competition.maxParticipants} participants`}</span>
//                     </div>
//                     <div className="flex items-center text-sm text-gray-600">
//                       <Star className="mr-2" size={16} />
//                       <span>Trust Score Required: {competition.trustScoreRequirement}</span>
//                     </div>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center">
//                       <img
//                         src={competition.organizer.avatar}
//                         alt={competition.organizer.name}
//                         className="w-6 h-6 rounded-full object-cover mr-2"
//                       />
//                       <span className="text-xs text-gray-600">{competition.organizer.name}</span>
//                     </div>
//                     <div className="flex space-x-2">
//                       <NewButton
//                         variant="outline"
//                         size="sm"
//                         onClick={() => openDetailsModal(competition)}
//                         icon={<Book size={14} />}
//                       >
//                         View Details
//                       </NewButton>
//                       {actionButton}
//                     </div>
//                   </div>
//                   {participationStatus[competition.id]?.error && (
//                     <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
//                       {participationStatus[competition.id].error}
//                     </div>
//                   )}
//                   {participationStatus[competition.id]?.success && (
//                     <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
//                       You have successfully joined the competition!
//                     </div>
//                   )}
//                   {participationStatus[competition.id]?.left && (
//                     <div className="mt-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg text-sm">
//                       You have successfully left the competition!
//                     </div>
//                   )}
//                 </div>
//                 <div className="px-6 pb-4">
//                   <div className="w-full bg-gray-200 rounded-full h-2">
//                     <div
//                       className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
//                       style={{ width: `${(competition.currentparticipants / competition.maxParticipants) * 100}%` }}
//                     ></div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {showDetailsModal && selectedCompetition && (
//         <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
//             <div className="p-6">
//               <div className="flex justify-between items-start mb-4">
//                 <div className="flex items-center">
//                   <Book className="text-blue-600 mr-3" size={24} />
//                   <div>
//                     <h3 className="text-xl font-bold text-gray-900">{selectedCompetition.title}</h3>
//                     <p className="text-gray-600">{selectedCompetition.category}</p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => {
//                     setShowDetailsModal(false);
//                     setSelectedCompetition(null);
//                   }}
//                   className="text-gray-500 hover:text-gray-700"
//                 >
//                   <X size={24} />
//                 </button>
//               </div>
//               <div className="space-y-4">
//                 <div>
//                   <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
//                   <p className="text-gray-700">{selectedCompetition.description}</p>
//                 </div>
//                 <div>
//                   <h4 className="font-semibold text-gray-900 mb-2">Rules</h4>
//                   <ul className="list-disc list-inside text-gray-700 space-y-1">
//                     {selectedCompetition.rules.map((rule, index) => (
//                       <li key={index}>{rule}</li>
//                     ))}
//                   </ul>
//                 </div>
//                 <div>
//                   <h4 className="font-semibold text-gray-900 mb-2">Judging Criteria</h4>
//                   <ul className="list-disc list-inside text-gray-700 space-y-1">
//                     {selectedCompetition.judgesCriteria.map((criterion, index) => (
//                       <li key={index}>{criterion}</li>
//                     ))}
//                   </ul>
//                 </div>
//                 <div className="space-y-2">
//                   <div className="flex items-center text-sm text-gray-600">
//                     <Trophy className="mr-2 text-yellow-500" size={16} />
//                     <span>Prize: {selectedCompetition.prize}</span>
//                   </div>
//                   <div className="flex items-center text-sm text-gray-600">
//                     <Calendar className="mr-2" size={16} />
//                     <span>Start Date: {formatDate(selectedCompetition.startDatetime)}</span>
//                   </div>
//                   <div className="flex items-center text-sm text-gray-600">
//                     <Calendar className="mr-2" size={16} />
//                     <span>Participation Deadline: {formatDate(selectedCompetition.endDatetime)}</span>
//                   </div>
//                   <div className="flex items-center text-sm text-gray-600">
//                     <Calendar className="mr-2" size={16} />
//                     <span>Voting Deadline: {formatDate(selectedCompetition.votingEndDatetime)}</span>
//                   </div>
//                   <div className="flex items-center text-sm text-gray-600">
//                     <Star className="mr-2" size={16} />
//                     <span>{`${selectedCompetition.currentparticipants}/${selectedCompetition.maxParticipants} participants`}</span>
//                   </div>
//                   <div className="flex items-center text-sm text-gray-600">
//                     <Star className="mr-2" size={16} />
//                     <span>Trust Score Required: {selectedCompetition.trustScoreRequirement}</span>
//                   </div>
//                   <div className="flex items-center text-sm text-gray-600">
//                     <Star className="mr-2" size={16} />
//                     <span>Created By: {selectedCompetition.organizer.name}</span>
//                   </div>
//                 </div>
//               </div>
//               <div className="mt-6 flex justify-end">
//                 <NewButton
//                   variant="outline"
//                   onClick={() => {
//                     setShowDetailsModal(false);
//                     setSelectedCompetition(null);
//                   }}
//                 >
//                   Close
//                 </NewButton>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </section>
//   );
// };

// NewCompetitions.propTypes = {
//   competitions: PropTypes.array.isRequired,
//   openSubmissionModal: PropTypes.func.isRequired,
//   onJoinSuccess: PropTypes.func.isRequired,
// };

// export default NewCompetitions;

