import React, { useState, useEffect, useRef } from "react";
import { Trophy, Calendar, Star, FileText, X, Crown, Edit, Trash2, Eye, Award, TrendingUp, CheckCircle } from "lucide-react";
import axios from "axios";
import PropTypes from "prop-types";
import { SubmissionEditor } from "./CompetitionSubmission";
import CompetitionSubmission from "./CompetitionSubmission";
import { useAuth } from "../../components/AuthContext";

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

// Inline getStatusColor Function
const getStatusColor = (status) => {
  switch (status) {
    case "Draft":
      return "bg-gray-100 text-gray-800 border-gray-300";
    case "Submitted":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "Under Review":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "Winner":
      return "bg-green-100 text-green-800 border-green-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

// Utility function to format dates
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const MyCompetitions = () => {
  const [participatedCompetitions, setParticipatedCompetitions] = useState([]);
  const [userSubmissions, setUserSubmissions] = useState([]);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showContentModal, setShowContentModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingSubmission, setEditingSubmission] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", content: "", wordCount: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editError, setEditError] = useState(null);
  const [editSuccess, setEditSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const baseUrl = "http://localhost:9090";
  const userEmail = user?.email || ""; // Replace with authenticated user's email

  // Fetch user participating competitions from API
  useEffect(() => {
    const fetchParticipatedCompetitions = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${baseUrl}/api/myCompetitions?email=${userEmail}`);
        if (response.status === 200) {
          setParticipatedCompetitions(response.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch participated competitions:", err);
        setParticipatedCompetitions([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchParticipatedCompetitions();
  }, [baseUrl, userEmail]);

  // Fetch user submissions from API
  useEffect(() => {
    const fetchUserSubmissions = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${baseUrl}/api/submissions/${userEmail}`);
        if (response.status === 200) {
          const fetchedSubmissions = response.data.map((sub) => ({
            id: sub.submissionId,
            competitionId: sub.competitionId,
            title: sub.title || "Untitled Submission",
            content: sub.content || "",
            status: sub.status || "Draft",
            submittedAt: sub.submittedAt || null,
            wordCount: calculateWordCount(sub.content),
            votes: sub.voteCount || 0,
            feedback: sub.feedback || null,
            ranking: sub.ranking || null,
            totalEntries: sub.totalEntries || null,
          }));
          setUserSubmissions(fetchedSubmissions);
        }
      } catch (err) {
        console.error("Failed to fetch submissions:", err);
        setUserSubmissions([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserSubmissions();
  }, [baseUrl, userEmail]);

  // Calculate word count from HTML content
  const calculateWordCount = (content) => {
    const text = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    return text.split(' ').filter(word => word.length > 0).length;
  };

  // Filter submissions based on voting end date
  const currentDate = new Date();

  const ongoingCompetitionSubmissions = userSubmissions.filter((submission) => {
    const competition = participatedCompetitions.find((c) => c.competition_id === submission.competitionId);
    if (!competition) return false;
    const votingEndDate = new Date(competition.voting_end_date_time);
    return votingEndDate >= currentDate;
  });

  const endedCompetitionSubmissions = userSubmissions.filter((submission) => {
    const competition = participatedCompetitions.find((c) => c.competition_id === submission.competitionId);
    if (!competition) return false;
    const votingEndDate = new Date(competition.voting_end_date_time);
    return votingEndDate < currentDate;
  });

  const handleEditChange = (field, value) => {
    if (field === "content") {
      const textOnly = value.replace(/<[^>]*>/g, ' ');
      const words = textOnly.split(/\s+/).filter(word => word.length > 0);
      setEditForm((prev) => ({
        ...prev,
        content: value,
        wordCount: words.length,
      }));
    } else {
      setEditForm((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleNewSubmission = (newSubmission) => {
    setUserSubmissions(prev => [...prev, newSubmission]);
  };

  const openSubmissionModal = (competition) => {
    setSelectedCompetition(competition);
    setShowSubmissionModal(true);
  };

  const handleEditSubmission = async () => {
    if (editingSubmission) {
      setIsEditing(true);
      setEditError(null);
      setEditSuccess(false);
      try {
        const submissionData = {
          submissionId: editingSubmission.id,
          competitionId: editingSubmission.competitionId,
          email: userEmail,
          userId: "", // Replace with actual userId if available
          title: editForm.title,
          content: editForm.content,
        };
        const response = await axios.post(
          `${baseUrl}/api/userSaveStory`,
          submissionData,
          { headers: { 'Content-Type': 'application/json' } }
        );

        console.log("Raw response:", response.data);

        // Parse response - backend returns {message: "{\"message\": \"success\", ...}"}
        let result = response.data;

        // First level: check if response.data.message is a string that needs parsing
        if (result.message && typeof result.message === 'string') {
          try {
            const parsed = JSON.parse(result.message);
            result = parsed; // Use the parsed inner object
            console.log("Parsed inner message:", result);
          } catch (e) {
            // If parsing fails, check if it's already the success message
            if (result.message === 'success') {
              // Backend changed format, use as is
            } else {
              console.error("Failed to parse message:", e);
            }
          }
        }

        // Check for success
        if (result?.message === 'success') {
          const submissionId = result.submissionId || editingSubmission.id;
          setUserSubmissions(prev => prev.map(sub =>
            sub.id === editingSubmission.id
              ? { ...sub, id: submissionId, title: editForm.title, content: editForm.content, wordCount: editForm.wordCount }
              : sub
          ));
          setEditSuccess(true);
          setTimeout(() => {
            setShowEditModal(false);
            setEditingSubmission(null);
            setEditForm({ title: "", content: "", wordCount: 0 });
            setEditSuccess(false);
          }, 1500);
        } else {
          setEditError('Failed to update submission: ' + (result?.error || 'Unknown error'));
        }
      } catch (error) {
        console.error("Error in handleEditSubmission:", error);
        setEditError('Error updating submission: ' + (error.response?.data?.message || error.message));
      } finally {
        setIsEditing(false);
      }
    }
  };

  const handleDeleteSubmission = async (submissionId) => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const response = await axios.delete(
        `${baseUrl}/api/user/deleteSubmission/${submissionId}`
      );
      const result = response.data;
      if (result.message === 'success') {
        setUserSubmissions(prev => prev.filter(sub => sub.id !== submissionId));
        setShowDeleteModal(false);
        setSelectedSubmission(null);
      } else {
        setDeleteError("Failed to delete submission: " + (result.message || "Unknown error"));
      }
    } catch (error) {
      setDeleteError("Error deleting submission: " + (error.response?.data?.message || error.message));
    } finally {
      setIsDeleting(false);
    }
  };

  const openEditModal = (submission) => {
    setEditingSubmission(submission);
    setEditForm({
      title: submission.title,
      content: submission.content,
      wordCount: submission.wordCount,
    });
    setShowEditModal(true);
    setEditError(null);
  };

  const openDeleteModal = (submission) => {
    setSelectedSubmission(submission);
    setShowDeleteModal(true);
    setDeleteError(null);
  };

  return (
    <section>
      <div className="bg-gradient-to-r from-blue-800 to-blue-900 rounded-xl p-6 text-white mb-6">
        <h2 className="text-2xl font-bold mb-2">My Competitions</h2>
        <p className="text-green-100">Manage your submissions and track your progress</p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      )}

      {ongoingCompetitionSubmissions.length > 0 && (
        <div className="mt-6 space-y-6">
          <h3 className="text-xl font-bold text-gray-900">Your Submissions for Ongoing Competitions</h3>
          {ongoingCompetitionSubmissions.map((submission) => {
            const competition = participatedCompetitions.find((c) => c.competition_id === submission.competitionId);
            const isWinner = submission.ranking === 1;
            const isTopThree = submission.ranking && submission.ranking <= 3;
            const votingEndDate = competition ? new Date(competition.voting_end_date_time) : null;
            const isEditable = votingEndDate && votingEndDate >= currentDate;
            return (
              <div
                key={submission.id}
                className={`bg-white rounded-xl shadow-sm border-2 hover:shadow-md transition-all duration-300 ${
                  isWinner ? 'border-yellow-300 bg-gradient-to-r from-yellow-50 to-amber-50' :
                  isTopThree ? 'border-green-300 bg-gradient-to-r from-green-50 to-emerald-50' :
                  'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-grow">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-bold text-gray-900 text-xl">{submission.title}</h3>
                        {isWinner && (
                          <div className="flex items-center bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            <Crown size={16} className="mr-1" />
                            Winner
                          </div>
                        )}
                        {isTopThree && !isWinner && (
                          <div className="flex items-center bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            <Award size={16} className="mr-1" />
                            Top {submission.ranking}
                          </div>
                        )}
                      </div>
                      <p className="text-gray-600 mb-2">{competition?.title || "Unknown Competition"}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Calendar size={14} className="mr-1" />
                          {submission.submittedAt ? `Submitted: ${formatDate(submission.submittedAt)}` : 'Not submitted yet'}
                        </span>
                        <span className="flex items-center">
                          <FileText size={14} className="mr-1" />
                          {submission.wordCount} words
                        </span>
                        {submission.votes > 0 && (
                          <span className="flex items-center">
                            <Star size={14} className="mr-1" />
                            {submission.votes} votes
                          </span>
                        )}
                        {submission.ranking && (
                          <span className="flex items-center">
                            <TrendingUp size={14} className="mr-1" />
                            Rank {submission.ranking} of {submission.totalEntries}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(submission.status)}`}>
                        {submission.status}
                      </span>
                    </div>
                  </div>
                  {submission.feedback && (
                    <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-2">Judge Feedback</h4>
                      <p className="text-blue-800">{submission.feedback}</p>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <NewButton
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedSubmission(submission);
                          setShowContentModal(true);
                        }}
                        icon={<Eye size={16} />}
                      >
                        View
                      </NewButton>
                      {/* {submission.status === 'Draft' && isEditable && (
                        <NewButton
                          variant="primary"
                          size="sm"
                          onClick={() => openEditModal(submission)}
                          icon={<Edit size={16} />}
                        >
                          Edit
                        </NewButton>
                      )} */}
                      {submission.status === 'Draft' && isEditable && (
                        <NewButton
                          variant="danger"
                          size="sm"
                          onClick={() => openDeleteModal(submission)}
                          icon={<Trash2 size={16} />}
                          disabled={isDeleting}
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
                        </NewButton>
                      )}
                    </div>
                    {submission.status === 'Draft' && isEditable && (
                      <NewButton
                        variant="success"
                        size="sm"
                        onClick={() => openEditModal(submission)}
                        icon={<Edit size={16} />}
                      >
                        Continue Draft
                      </NewButton>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}


      {ongoingCompetitionSubmissions.length === 0 && !isLoading && (
        <div className="mt-6 text-center py-12">
          <Trophy className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No ongoing submissions yet</h3>
          <p className="text-gray-500">Submit to a competition to see your entries here!</p>
        </div>
      )}

      <CompetitionSubmission
        selectedCompetition={selectedCompetition}
        showSubmissionModal={showSubmissionModal}
        setShowSubmissionModal={setShowSubmissionModal}
        onSubmit={handleNewSubmission}
        setSelectedCompetition={setSelectedCompetition}
        setActiveTab={() => {}}
      />

      {showEditModal && editingSubmission && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-2">Edit Submission</h3>
                  <p className="text-gray-600">{editingSubmission.title}</p>
                </div>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingSubmission(null);
                    setEditForm({ title: "", content: "", wordCount: 0 });
                    setEditError(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              {editError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  {editError}
                </div>
              )}
              {editSuccess && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm flex items-center">
                  <CheckCircle size={18} className="mr-2 text-green-600" />
                  Draft updated successfully!
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Entry Title</label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => handleEditChange("title", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your submission title..."
                    disabled={isEditing || editSuccess}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Entry</label>
                  <SubmissionEditor
                    key={`editor-edit-${editingSubmission?.id || 'new'}`}
                    initialContent={editForm.content}
                    onChange={(content) => handleEditChange("content", content)}
                    wordCount={editForm.wordCount}
                    disabled={isEditing || editSuccess}
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <NewButton
                  variant="outline"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingSubmission(null);
                    setEditForm({ title: "", content: "", wordCount: 0 });
                    setEditError(null);
                    setEditSuccess(false);
                  }}
                  disabled={isEditing || editSuccess}
                >
                  Cancel
                </NewButton>
                <NewButton
                  variant="primary"
                  onClick={handleEditSubmission}
                  disabled={!editForm.title || !editForm.content || isEditing || editSuccess}
                  icon={<Edit size={16} />}
                >
                  {isEditing ? (
                    <>
                      <span className="mr-2">Saving...</span>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </>
                  ) : "Save Changes"}
                </NewButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {showContentModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-2">View Submission</h3>
                  <p className="text-gray-600">{selectedSubmission.title}</p>
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
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 max-h-96 overflow-y-auto">
                    <div
                      className="text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: selectedSubmission.content }}
                    />
                  </div>
                </div>
                {selectedSubmission.wordCount && (
                  <div className="text-sm text-gray-500">Word count: {selectedSubmission.wordCount}</div>
                )}
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <NewButton
                  variant="outline"
                  onClick={() => {
                    setShowContentModal(false);
                    setSelectedSubmission(null);
                  }}
                >
                  Close
                </NewButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 p-3 rounded-full mr-4">
                  <Trash2 className="text-red-600" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Delete Submission</h3>
                  <p className="text-gray-600">Are you sure you want to delete this submission?</p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-medium text-gray-900">{selectedSubmission.title}</h4>
                <p className="text-sm text-gray-600">Status: {selectedSubmission.status}</p>
              </div>
              {deleteError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  {deleteError}
                </div>
              )}
              <p className="text-sm text-red-600 mb-6">This action cannot be undone.</p>
              <div className="flex justify-end space-x-3">
                <NewButton
                  variant="outline"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedSubmission(null);
                    setDeleteError(null);
                  }}
                >
                  Cancel
                </NewButton>
                <NewButton
                  variant="danger"
                  onClick={() => handleDeleteSubmission(selectedSubmission.id)}
                  icon={<Trash2 size={16} />}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <span className="mr-2">Deleting...</span>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </>
                  ) : "Delete"}
                </NewButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default MyCompetitions;





// import React, { useState, useEffect, useRef } from "react";
// import { Trophy, Calendar, Star, FileText, X, Crown, Edit, Trash2, Eye, Award, TrendingUp } from "lucide-react";
// import axios from "axios";
// import { Editor } from '@tinymce/tinymce-react';
// import CompetitionSubmission from "./CompetitionSubmission";
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

// // Inline getStatusColor Function
// const getStatusColor = (status) => {
//   switch (status) {
//     case "Draft":
//       return "bg-gray-100 text-gray-800 border-gray-300";
//     case "Submitted":
//       return "bg-blue-100 text-blue-800 border-blue-300";
//     case "Under Review":
//       return "bg-yellow-100 text-yellow-800 border-yellow-300";
//     case "Winner":
//       return "bg-green-100 text-green-800 border-green-300";
//     default:
//       return "bg-gray-100 text-gray-800 border-gray-300";
//   }
// };

// // Utility function to format dates
// const formatDate = (dateString) => {
//   if (!dateString) return "N/A";
//   const date = new Date(dateString);
//   return date.toLocaleDateString("en-US", {
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// };

// const MyCompetitions = () => {
//   const [participatedCompetitions, setParticipatedCompetitions] = useState([]);
//   const [userSubmissions, setUserSubmissions] = useState([]);
//   const [selectedCompetition, setSelectedCompetition] = useState(null);
//   const [showSubmissionModal, setShowSubmissionModal] = useState(false);
//   const [selectedSubmission, setSelectedSubmission] = useState(null);
//   const [showContentModal, setShowContentModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [editingSubmission, setEditingSubmission] = useState(null);
//   const [editForm, setEditForm] = useState({ title: "", content: "", wordCount: 0 });
//   const [isEditing, setIsEditing] = useState(false);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [editError, setEditError] = useState(null);
//   const [deleteError, setDeleteError] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const baseUrl = "http://localhost:9090";
//   const userEmail = "user@gmail.com"; // Replace with authenticated user's email
//   const editorRef = useRef(null);

//   // Fetch user participating competitions from API
//   useEffect(() => {
//     const fetchParticipatedCompetitions = async () => {
//       setIsLoading(true);
//       setError(null);
//       try {
//         const response = await axios.get(`${baseUrl}/api/myCompetitions?email=${userEmail}`);
//         if (response.status === 200) {
//           setParticipatedCompetitions(response.data || []);
//         } else {
//           setError("No competitions found for this user.");
//         }
//       } catch (err) {
//         setError("Failed to fetch participated competitions: " + (err.response?.data || err.message));
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchParticipatedCompetitions();
//   }, [baseUrl, userEmail]);

//   // Fetch user submissions from API
//   useEffect(() => {
//     const fetchUserSubmissions = async () => {
//       setIsLoading(true);
//       setError(null);
//       try {
//         const response = await axios.get(`${baseUrl}/api/submissions/${userEmail}`);
//         if (response.status === 200) {
//           const fetchedSubmissions = response.data.map((sub) => ({
//             id: sub.submissionId,
//             competitionId: sub.competitionId,
//             title: sub.title || "Untitled Submission",
//             content: sub.content || "",
//             status: sub.status || "Draft",
//             submittedAt: sub.submittedAt || null,
//             wordCount: calculateWordCount(sub.content),
//             votes: sub.voteCount || 0,
//             feedback: sub.feedback || null,
//             ranking: sub.ranking || null,
//             totalEntries: sub.totalEntries || null,
//           }));
//           setUserSubmissions(fetchedSubmissions);
//         } else {
//           setError("No submissions found for this user.");
//         }
//       } catch (err) {
//         setError("Failed to fetch submissions: " + (err.response?.data || err.message));
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchUserSubmissions();
//   }, [baseUrl, userEmail]);

//   // Calculate word count from HTML content
//   const calculateWordCount = (content) => {
//     const text = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
//     return text.split(' ').filter(word => word.length > 0).length;
//   };

//   // Filter submissions based on voting end date
//   const currentDate = new Date();

//   const ongoingCompetitionSubmissions = userSubmissions.filter((submission) => {
//     const competition = participatedCompetitions.find((c) => c.competition_id === submission.competitionId);
//     if (!competition) return false;
//     const votingEndDate = new Date(competition.voting_end_date_time);
//     return votingEndDate >= currentDate;
//   });

//   const endedCompetitionSubmissions = userSubmissions.filter((submission) => {
//     const competition = participatedCompetitions.find((c) => c.competition_id === submission.competitionId);
//     if (!competition) return false;
//     const votingEndDate = new Date(competition.voting_end_date_time);
//     return votingEndDate < currentDate;
//   });

//   const handleEditChange = (field, value) => {
//     if (field === "content") {
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

//   const handleNewSubmission = (newSubmission) => {
//     setUserSubmissions(prev => [...prev, newSubmission]);
//   };

//   const openSubmissionModal = (competition) => {
//     setSelectedCompetition(competition);
//     setShowSubmissionModal(true);
//   };

//   const handleEditSubmission = async () => {
//     if (editingSubmission) {
//       setIsEditing(true);
//       setEditError(null);
//       try {
//         const submissionData = {
//           submissionId: editingSubmission.id,
//           competitionId: editingSubmission.competitionId,
//           email: userEmail,
//           userId: "", // Replace with actual userId if available
//           title: editForm.title,
//           content: editForm.content,
//           status: "Draft", // Ensure status remains Draft
//         };
//         const response = await axios.post(
//           `${baseUrl}/api/userSaveStory`,
//           submissionData,
//           { headers: { 'Content-Type': 'application/json' } }
//         );
//         const result = response.data;
//         if (result.message === 'success') {
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
//         setEditError('Error updating submission: ' + (error.response?.data?.message || error.message));
//       } finally {
//         setIsEditing(false);
//       }
//     }
//   };

//   const handleDeleteSubmission = async (submissionId) => {
//     setIsDeleting(true);
//     setDeleteError(null);
//     try {
//       const response = await axios.delete(
//         `${baseUrl}/api/user/deleteSubmission/${submissionId}`
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
//       setDeleteError("Error deleting submission: " + (error.response?.data?.message || error.message));
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   const openEditModal = (submission) => {
//     setEditingSubmission(submission);
//     setEditForm({
//       title: submission.title,
//       content: submission.content,
//       wordCount: submission.wordCount,
//     });
//     setShowEditModal(true);
//     setEditError(null);
//   };

//   const openDeleteModal = (submission) => {
//     setSelectedSubmission(submission);
//     setShowDeleteModal(true);
//     setDeleteError(null);
//   };

//   return (
//     <section>
//       <div className="bg-gradient-to-r from-blue-800 to-blue-900 rounded-xl p-6 text-white mb-6">
//         <h2 className="text-2xl font-bold mb-2">My Competitions</h2>
//         <p className="text-green-100">Manage your submissions and track your progress</p>
//       </div>

//       {isLoading && (
//         <div className="flex items-center justify-center py-8">
//           <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//           <span className="ml-2 text-gray-600">Loading...</span>
//         </div>
//       )}
//       {error && (
//         <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
//           {error}
//         </div>
//       )}

//       {ongoingCompetitionSubmissions.length > 0 && (
//         <div className="mt-6 space-y-6">
//           <h3 className="text-xl font-bold text-gray-900">Your Submissions for Ongoing Competitions</h3>
//           {ongoingCompetitionSubmissions.map((submission) => {
//             const competition = participatedCompetitions.find((c) => c.competition_id === submission.competitionId);
//             const isWinner = submission.ranking === 1;
//             const isTopThree = submission.ranking && submission.ranking <= 3;
//             const votingEndDate = competition ? new Date(competition.voting_end_date_time) : null;
//             const isEditable = votingEndDate && votingEndDate >= currentDate;
//             return (
//               <div
//                 key={submission.id}
//                 className={`bg-white rounded-xl shadow-sm border-2 hover:shadow-md transition-all duration-300 ${
//                   isWinner ? 'border-yellow-300 bg-gradient-to-r from-yellow-50 to-amber-50' :
//                   isTopThree ? 'border-green-300 bg-gradient-to-r from-green-50 to-emerald-50' :
//                   'border-gray-200 hover:border-gray-300'
//                 }`}
//               >
//                 <div className="p-6">
//                   <div className="flex justify-between items-start mb-4">
//                     <div className="flex-grow">
//                       <div className="flex items-center space-x-3 mb-2">
//                         <h3 className="font-bold text-gray-900 text-xl">{submission.title}</h3>
//                         {isWinner && (
//                           <div className="flex items-center bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
//                             <Crown size={16} className="mr-1" />
//                             Winner
//                           </div>
//                         )}
//                         {isTopThree && !isWinner && (
//                           <div className="flex items-center bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
//                             <Award size={16} className="mr-1" />
//                             Top {submission.ranking}
//                           </div>
//                         )}
//                       </div>
//                       <p className="text-gray-600 mb-2">{competition?.title || "Unknown Competition"}</p>
//                       <div className="flex items-center space-x-4 text-sm text-gray-500">
//                         <span className="flex items-center">
//                           <Calendar size={14} className="mr-1" />
//                           {submission.submittedAt ? `Submitted: ${formatDate(submission.submittedAt)}` : 'Not submitted yet'}
//                         </span>
//                         <span className="flex items-center">
//                           <FileText size={14} className="mr-1" />
//                           {submission.wordCount} words
//                         </span>
//                         {submission.votes > 0 && (
//                           <span className="flex items-center">
//                             <Star size={14} className="mr-1" />
//                             {submission.votes} votes
//                           </span>
//                         )}
//                         {submission.ranking && (
//                           <span className="flex items-center">
//                             <TrendingUp size={14} className="mr-1" />
//                             Rank {submission.ranking} of {submission.totalEntries}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(submission.status)}`}>
//                         {submission.status}
//                       </span>
//                     </div>
//                   </div>
//                   {submission.feedback && (
//                     <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
//                       <h4 className="font-semibold text-blue-900 mb-2">Judge Feedback</h4>
//                       <p className="text-blue-800">{submission.feedback}</p>
//                     </div>
//                   )}
//                   <div className="flex justify-between items-center">
//                     <div className="flex items-center space-x-3">
//                       <NewButton
//                         variant="outline"
//                         size="sm"
//                         onClick={() => {
//                           setSelectedSubmission(submission);
//                           setShowContentModal(true);
//                         }}
//                         icon={<Eye size={16} />}
//                       >
//                         View
//                       </NewButton>
//                       {submission.status === 'Draft' && isEditable && (
//                         <NewButton
//                           variant="primary"
//                           size="sm"
//                           onClick={() => openEditModal(submission)}
//                           icon={<Edit size={16} />}
//                         >
//                           Edit
//                         </NewButton>
//                       )}
//                       {submission.status === 'Draft' && isEditable && (
//                         <NewButton
//                           variant="danger"
//                           size="sm"
//                           onClick={() => openDeleteModal(submission)}
//                           icon={<Trash2 size={16} />}
//                           disabled={isDeleting}
//                         >
//                           {isDeleting ? "Deleting..." : "Delete"}
//                         </NewButton>
//                       )}
//                     </div>
//                     {submission.status === 'Draft' && isEditable && (
//                       <NewButton
//                         variant="success"
//                         size="sm"
//                         onClick={() => openEditModal(submission)}
//                         icon={<Edit size={16} />}
//                       >
//                         Continue Draft
//                       </NewButton>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {endedCompetitionSubmissions.length > 0 && (
//         <div className="mt-6 space-y-6">
//           <h3 className="text-xl font-bold text-gray-900">Your Submissions for Ended Competitions</h3>
//           {endedCompetitionSubmissions.map((submission) => {
//             const competition = participatedCompetitions.find((c) => c.competition_id === submission.competitionId);
//             const isWinner = submission.ranking === 1;
//             const isTopThree = submission.ranking && submission.ranking <= 3;
//             return (
//               <div
//                 key={submission.id}
//                 className={`bg-white rounded-xl shadow-sm border-2 hover:shadow-md transition-all duration-300 ${
//                   isWinner ? 'border-yellow-300 bg-gradient-to-r from-yellow-50 to-amber-50' :
//                   isTopThree ? 'border-green-300 bg-gradient-to-r from-green-50 to-emerald-50' :
//                   'border-gray-200 hover:border-gray-300'
//                 }`}
//               >
//                 <div className="p-6">
//                   <div className="flex justify-between items-start mb-4">
//                     <div className="flex-grow">
//                       <div className="flex items-center space-x-3 mb-2">
//                         <h3 className="font-bold text-gray-900 text-xl">{submission.title}</h3>
//                         {isWinner && (
//                           <div className="flex items-center bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
//                             <Crown size={16} className="mr-1" />
//                             Winner
//                           </div>
//                         )}
//                         {isTopThree && !isWinner && (
//                           <div className="flex items-center bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
//                             <Award size={16} className="mr-1" />
//                             Top {submission.ranking}
//                           </div>
//                         )}
//                       </div>
//                       <p className="text-gray-600 mb-2">{competition?.title || "Unknown Competition"}</p>
//                       <div className="flex items-center space-x-4 text-sm text-gray-500">
//                         <span className="flex items-center">
//                           <Calendar size={14} className="mr-1" />
//                           {submission.submittedAt ? `Submitted: ${formatDate(submission.submittedAt)}` : 'Not submitted yet'}
//                         </span>
//                         <span className="flex items-center">
//                           <FileText size={14} className="mr-1" />
//                           {submission.wordCount} words
//                         </span>
//                         {submission.votes > 0 && (
//                           <span className="flex items-center">
//                             <Star size={14} className="mr-1" />
//                             {submission.votes} votes
//                           </span>
//                         )}
//                         {submission.ranking && (
//                           <span className="flex items-center">
//                             <TrendingUp size={14} className="mr-1" />
//                             Rank {submission.ranking} of {submission.totalEntries}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(submission.status)}`}>
//                         {submission.status}
//                       </span>
//                     </div>
//                   </div>
//                   {submission.feedback && (
//                     <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
//                       <h4 className="font-semibold text-blue-900 mb-2">Judge Feedback</h4>
//                       <p className="text-blue-800">{submission.feedback}</p>
//                     </div>
//                   )}
//                   <div className="flex justify-between items-center">
//                     <div className="flex items-center space-x-3">
//                       <NewButton
//                         variant="outline"
//                         size="sm"
//                         onClick={() => {
//                           setSelectedSubmission(submission);
//                           setShowContentModal(true);
//                         }}
//                         icon={<Eye size={16} />}
//                       >
//                         View
//                       </NewButton>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {ongoingCompetitionSubmissions.length === 0 && endedCompetitionSubmissions.length === 0 && !isLoading && !error && (
//         <div className="mt-6 text-center py-12">
//           <Trophy className="mx-auto h-12 w-12 text-gray-300 mb-3" />
//           <h3 className="text-lg font-semibold text-gray-900 mb-2">No submissions yet</h3>
//           <p className="text-gray-500">Submit to a competition to see your entries here!</p>
//         </div>
//       )}

//       <CompetitionSubmission
//         selectedCompetition={selectedCompetition}
//         showSubmissionModal={showSubmissionModal}
//         setShowSubmissionModal={setShowSubmissionModal}
//         onSubmit={handleNewSubmission}
//         setSelectedCompetition={setSelectedCompetition}
//         setActiveTab={() => {}}
//       />

//       {showEditModal && editingSubmission && (
//         <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
//             <div className="p-6">
//               <div className="flex justify-between items-start mb-4">
//                 <div>
//                   <h3 className="text-xl font-bold mb-2">Edit Submission</h3>
//                   <p className="text-gray-600">{editingSubmission.title}</p>
//                 </div>
//                 <button
//                   onClick={() => {
//                     setShowEditModal(false);
//                     setEditingSubmission(null);
//                     setEditForm({ title: "", content: "", wordCount: 0 });
//                     setEditError(null);
//                   }}
//                   className="text-gray-500 hover:text-gray-700"
//                 >
//                   <X size={24} />
//                 </button>
//               </div>
//               {editError && (
//                 <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
//                   {editError}
//                 </div>
//               )}
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Entry Title</label>
//                   <input
//                     type="text"
//                     value={editForm.title}
//                     onChange={(e) => handleEditChange("title", e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     placeholder="Enter your submission title..."
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Your Entry</label>
//                   <Editor
//                     apiKey="bt1w2ivk1v3fqe0n5lkisczo8gbyjwgw0tp7ur75kmuxobvb"
//                     onInit={(evt, editor) => editorRef.current = editor}
//                     initialValue={editForm.content}
//                     value={editForm.content}
//                     onEditorChange={(content) => handleEditChange("content", content)}
//                     init={{
//                       height: 350,
//                       menubar: false,
//                       plugins: ['advlist', 'autolink', 'lists', 'link', 'charmap', 'searchreplace', 'visualblocks', 'code', 'fullscreen', 'insertdatetime', 'table', 'wordcount'],
//                       toolbar: 'undo redo | formatselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | fontsize | removeformat | help',
//                       content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
//                       fontsize_formats: '8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt',
//                       branding: false,
//                       resize: false,
//                       statusbar: false,
//                     }}
//                   />
//                   <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
//                     <span>Word count: {editForm.wordCount}</span>
//                     <span>Changes will be saved as draft</span>
//                   </div>
//                 </div>
//               </div>
//               <div className="mt-6 flex justify-end space-x-3">
//                 <NewButton
//                   variant="outline"
//                   onClick={() => {
//                     setShowEditModal(false);
//                     setEditingSubmission(null);
//                     setEditForm({ title: "", content: "", wordCount: 0 });
//                     setEditError(null);
//                   }}
//                 >
//                   Cancel
//                 </NewButton>
//                 <NewButton
//                   variant="primary"
//                   onClick={handleEditSubmission}
//                   disabled={!editForm.title || !editForm.content || isEditing}
//                   icon={<Edit size={16} />}
//                 >
//                   {isEditing ? (
//                     <>
//                       <span className="mr-2">Saving...</span>
//                       <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                     </>
//                   ) : "Save Changes"}
//                 </NewButton>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {showContentModal && selectedSubmission && (
//         <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
//             <div className="p-6">
//               <div className="flex justify-between items-start mb-4">
//                 <div>
//                   <h3 className="text-xl font-bold mb-2">View Submission</h3>
//                   <p className="text-gray-600">{selectedSubmission.title}</p>
//                 </div>
//                 <button
//                   onClick={() => {
//                     setShowContentModal(false);
//                     setSelectedSubmission(null);
//                   }}
//                   className="text-gray-500 hover:text-gray-700"
//                 >
//                   <X size={24} />
//                 </button>
//               </div>
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
//                   <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 max-h-96 overflow-y-auto">
//                     <div
//                       className="text-gray-700 leading-relaxed"
//                       dangerouslySetInnerHTML={{ __html: selectedSubmission.content }}
//                     />
//                   </div>
//                 </div>
//                 {selectedSubmission.wordCount && (
//                   <div className="text-sm text-gray-500">Word count: {selectedSubmission.wordCount}</div>
//                 )}
//               </div>
//               <div className="mt-6 flex justify-end space-x-3">
//                 <NewButton
//                   variant="outline"
//                   onClick={() => {
//                     setShowContentModal(false);
//                     setSelectedSubmission(null);
//                   }}
//                 >
//                   Close
//                 </NewButton>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {showDeleteModal && selectedSubmission && (
//         <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl max-w-md w-full shadow-2xl">
//             <div className="p-6">
//               <div className="flex items-center mb-4">
//                 <div className="bg-red-100 p-3 rounded-full mr-4">
//                   <Trash2 className="text-red-600" size={24} />
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-bold text-gray-900">Delete Submission</h3>
//                   <p className="text-gray-600">Are you sure you want to delete this submission?</p>
//                 </div>
//               </div>
//               <div className="bg-gray-50 p-4 rounded-lg mb-4">
//                 <h4 className="font-medium text-gray-900">{selectedSubmission.title}</h4>
//                 <p className="text-sm text-gray-600">Status: {selectedSubmission.status}</p>
//               </div>
//               {deleteError && (
//                 <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
//                   {deleteError}
//                 </div>
//               )}
//               <p className="text-sm text-red-600 mb-6">This action cannot be undone.</p>
//               <div className="flex justify-end space-x-3">
//                 <NewButton
//                   variant="outline"
//                   onClick={() => {
//                     setShowDeleteModal(false);
//                     setSelectedSubmission(null);
//                     setDeleteError(null);
//                   }}
//                 >
//                   Cancel
//                 </NewButton>
//                 <NewButton
//                   variant="danger"
//                   onClick={() => handleDeleteSubmission(selectedSubmission.id)}
//                   icon={<Trash2 size={16} />}
//                   disabled={isDeleting}
//                 >
//                   {isDeleting ? (
//                     <>
//                       <span className="mr-2">Deleting...</span>
//                       <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                     </>
//                   ) : "Delete"}
//                 </NewButton>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </section>
//   );
// };

// export default MyCompetitions;

// import React, { useState, useEffect, useRef } from "react";
// import { Trophy, Calendar, Star, Send, FileText, X, Crown, Edit, Trash2, Eye, Award, TrendingUp } from "lucide-react";
// import axios from "axios";
// import { Editor } from '@tinymce/tinymce-react';
// import CompetitionSubmission from "./CompetitionSubmission";
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

// // Inline getStatusColor Function
// const getStatusColor = (status) => {
//   switch (status) {
//     case "Draft":
//       return "bg-gray-100 text-gray-800 border-gray-300";
//     case "Submitted":
//       return "bg-blue-100 text-blue-800 border-blue-300";
//     case "Under Review":
//       return "bg-yellow-100 text-yellow-800 border-yellow-300";
//     case "Winner":
//       return "bg-green-100 text-green-800 border-green-300";
//     default:
//       return "bg-gray-100 text-gray-800 border-gray-300";
//   }
// };

// const MyCompetitions = ({ competitions, userSubmissions: initialSubmissions, userParticipatedCompetitions }) => {
//   const [userSubmissions, setUserSubmissions] = useState(initialSubmissions);
//   const [selectedCompetition, setSelectedCompetition] = useState(null);
//   const [showSubmissionModal, setShowSubmissionModal] = useState(false);
//   const [selectedSubmission, setSelectedSubmission] = useState(null);
//   const [showContentModal, setShowContentModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [editingSubmission, setEditingSubmission] = useState(null);
//   const [editForm, setEditForm] = useState({ title: "", content: "", wordCount: 0 });
//   const [isEditing, setIsEditing] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [editError, setEditError] = useState(null);
//   const [submitError, setSubmitError] = useState(null);
//   const [deleteError, setDeleteError] = useState(null);
//   const baseUrl = "http://localhost:9090";
//   const editorRef = useRef(null);

//   const participatedCompetitions = competitions.filter((competition) =>
//     userParticipatedCompetitions.includes(competition.id)
//   );

//   const handleEditChange = (field, value) => {
//     if (field === "content") {
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

//   const handleNewSubmission = (newSubmission) => {
//     setUserSubmissions(prev => [...prev, newSubmission]);
//   };

//   const openSubmissionModal = (competition) => {
//     setSelectedCompetition(competition);
//     setShowSubmissionModal(true);
//   };

//   const handleEditSubmission = async () => {
//     if (editingSubmission) {
//       setIsEditing(true);
//       setEditError(null);
//       try {
//         const submissionData = {
//           submissionId: editingSubmission.id,
//           competitionId: editingSubmission.competitionId,
//           email: "",
//           userId: "",
//           title: editForm.title,
//           content: editForm.content,
//         };
//         const response = await axios.post(
//           `${baseUrl}/api/userSaveStory`,
//           submissionData,
//           { headers: { 'Content-Type': 'application/json' } }
//         );
//         const result = response.data;
//         if (result.message === 'success') {
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
//         setEditError('Error updating submission: ' + (error.response?.data?.message || error.message));
//       } finally {
//         setIsEditing(false);
//       }
//     }
//   };

//   const handleSubmitToCompetition = async (submission) => {
//     setIsSubmitting(true);
//     setSubmitError(null);
//     try {
//       const submissionData = {
//         submissionId: submission.id,
//         competitionId: submission.competitionId,
//         email: "",
//         userId: "",
//         title: submission.title,
//         content: submission.content,
//         status: "Submitted",
//       };
//       const response = await axios.post(
//         `${baseUrl}/api/userSaveStory`,
//         submissionData,
//         { headers: { 'Content-Type': 'application/json' } }
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
//       setSubmitError("Error submitting entry: " + (error.response?.data?.message || error.message));
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleDeleteSubmission = async (submissionId) => {
//     setIsDeleting(true);
//     setDeleteError(null);
//     try {
//       const response = await axios.delete(
//         `${baseUrl}/api/user/deleteSubmission/${submissionId}`
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
//       setDeleteError("Error deleting submission: " + (error.response?.data?.message || error.message));
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   const openEditModal = (submission) => {
//     setEditingSubmission(submission);
//     setEditForm({
//       title: submission.title,
//       content: submission.content,
//       wordCount: submission.wordCount,
//     });
//     setShowEditModal(true);
//     setEditError(null);
//   };

//   const openDeleteModal = (submission) => {
//     setSelectedSubmission(submission);
//     setShowDeleteModal(true);
//     setDeleteError(null);
//   };

//   return (
//     <section>
//       <div className="bg-gradient-to-r from-blue-800 to-blue-900 rounded-xl p-6 text-white mb-6">
//         <h2 className="text-2xl font-bold mb-2">My Competitions</h2>
//         <p className="text-green-100">Manage your submissions and track your progress</p>
//       </div>

//       {participatedCompetitions.length > 0 ? (
//         <div className="space-y-6">
//           {participatedCompetitions.map((competition) => (
//             <div key={competition.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//               <div className="p-6">
//                 <h3 className="font-semibold text-gray-900 text-lg mb-1">{competition.title}</h3>
//                 <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
//                   {competition.category}
//                 </span>
//                 <p className="text-gray-600 text-sm mb-4">Deadline: {competition.deadline}</p>
//                 <NewButton
//                   variant="primary"
//                   size="sm"
//                   onClick={() => openSubmissionModal(competition)}
//                   icon={<Send size={14} />}
//                 >
//                   Submit Entry
//                 </NewButton>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="text-center py-16">
//           <Trophy className="mx-auto h-12 w-12 text-gray-300 mb-3" />
//           <h3 className="text-lg font-semibold text-gray-900 mb-2">No competitions joined</h3>
//           <p className="text-gray-500">Join a competition to start submitting!</p>
//         </div>
//       )}

//       {userSubmissions.length > 0 && (
//         <div className="mt-6 space-y-6">
//           <h3 className="text-xl font-bold text-gray-900">Your Submissions</h3>
//           {userSubmissions.map((submission) => {
//             const competition = competitions.find((c) => c.id === submission.competitionId);
//             const isWinner = submission.ranking === 1;
//             const isTopThree = submission.ranking && submission.ranking <= 3;
//             return (
//               <div
//                 key={submission.id}
//                 className={`bg-white rounded-xl shadow-sm border-2 hover:shadow-md transition-all duration-300 ${
//                   isWinner ? 'border-yellow-300 bg-gradient-to-r from-yellow-50 to-amber-50' :
//                   isTopThree ? 'border-green-300 bg-gradient-to-r from-green-50 to-emerald-50' :
//                   'border-gray-200 hover:border-gray-300'
//                 }`}
//               >
//                 <div className="p-6">
//                   <div className="flex justify-between items-start mb-4">
//                     <div className="flex-grow">
//                       <div className="flex items-center space-x-3 mb-2">
//                         <h3 className="font-bold text-gray-900 text-xl">{submission.title}</h3>
//                         {isWinner && (
//                           <div className="flex items-center bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
//                             <Crown size={16} className="mr-1" />
//                             Winner
//                           </div>
//                         )}
//                         {isTopThree && !isWinner && (
//                           <div className="flex items-center bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
//                             <Award size={16} className="mr-1" />
//                             Top {submission.ranking}
//                           </div>
//                         )}
//                       </div>
//                       <p className="text-gray-600 mb-2">{competition?.title || "Unknown Competition"}</p>
//                       <div className="flex items-center space-x-4 text-sm text-gray-500">
//                         <span className="flex items-center">
//                           <Calendar size={14} className="mr-1" />
//                           {submission.submittedAt ? `Submitted: ${submission.submittedAt}` : 'Not submitted yet'}
//                         </span>
//                         <span className="flex items-center">
//                           <FileText size={14} className="mr-1" />
//                           {submission.wordCount} words
//                         </span>
//                         {submission.votes > 0 && (
//                           <span className="flex items-center">
//                             <Star size={14} className="mr-1" />
//                             {submission.votes} votes
//                           </span>
//                         )}
//                         {submission.ranking && (
//                           <span className="flex items-center">
//                             <TrendingUp size={14} className="mr-1" />
//                             Rank {submission.ranking} of {submission.totalEntries}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(submission.status)}`}>
//                         {submission.status}
//                       </span>
//                     </div>
//                   </div>
//                   {submission.feedback && (
//                     <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
//                       <h4 className="font-semibold text-blue-900 mb-2">Judge Feedback</h4>
//                       <p className="text-blue-800">{submission.feedback}</p>
//                     </div>
//                   )}
//                   {submitError && submission.status === 'Draft' && (
//                     <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
//                       {submitError}
//                     </div>
//                   )}
//                   <div className="flex justify-between items-center">
//                     <div className="flex items-center space-x-3">
//                       <NewButton
//                         variant="outline"
//                         size="sm"
//                         onClick={() => {
//                           setSelectedSubmission(submission);
//                           setShowContentModal(true);
//                         }}
//                         icon={<Eye size={16} />}
//                       >
//                         View
//                       </NewButton>
//                       {submission.status === 'Draft' && (
//                         <NewButton
//                           variant="primary"
//                           size="sm"
//                           onClick={() => openEditModal(submission)}
//                           icon={<Edit size={16} />}
//                         >
//                           Edit
//                         </NewButton>
//                       )}
//                       <NewButton
//                         variant="danger"
//                         size="sm"
//                         onClick={() => openDeleteModal(submission)}
//                         icon={<Trash2 size={16} />}
//                         disabled={isDeleting}
//                       >
//                         {isDeleting ? "Deleting..." : "Delete"}
//                       </NewButton>
//                     </div>
//                     {submission.status === 'Draft' && (
//                       <NewButton
//                         variant="success"
//                         size="sm"
//                         onClick={() => handleSubmitToCompetition(submission)}
//                         icon={<Send size={16} />}
//                         disabled={isSubmitting}
//                       >
//                         {isSubmitting ? (
//                           <>
//                             <span className="mr-2">Submitting...</span>
//                             <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                           </>
//                         ) : "Submit"}
//                       </NewButton>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       <CompetitionSubmission
//         selectedCompetition={selectedCompetition}
//         showSubmissionModal={showSubmissionModal}
//         setShowSubmissionModal={setShowSubmissionModal}
//         onSubmit={handleNewSubmission}
//         setSelectedCompetition={setSelectedCompetition}
//         setActiveTab={() => {}}
//       />

//       {showEditModal && editingSubmission && (
//         <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
//             <div className="p-6">
//               <div className="flex justify-between items-start mb-4">
//                 <div>
//                   <h3 className="text-xl font-bold mb-2">Edit Submission</h3>
//                   <p className="text-gray-600">{editingSubmission.title}</p>
//                 </div>
//                 <button
//                   onClick={() => {
//                     setShowEditModal(false);
//                     setEditingSubmission(null);
//                     setEditForm({ title: "", content: "", wordCount: 0 });
//                     setEditError(null);
//                   }}
//                   className="text-gray-500 hover:text-gray-700"
//                 >
//                   <X size={24} />
//                 </button>
//               </div>
//               {editError && (
//                 <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
//                   {editError}
//                 </div>
//               )}
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Entry Title</label>
//                   <input
//                     type="text"
//                     value={editForm.title}
//                     onChange={(e) => handleEditChange("title", e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     placeholder="Enter your submission title..."
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Your Entry</label>
//                   <Editor
//                     apiKey="bt1w2ivk1v3fqe0n5lkisczo8gbyjwgw0tp7ur75kmuxobvb"
//                     onInit={(evt, editor) => editorRef.current = editor}
//                     initialValue={editForm.content}
//                     value={editForm.content}
//                     onEditorChange={(content) => handleEditChange("content", content)}
//                     init={{
//                       height: 350,
//                       menubar: false,
//                       plugins: ['advlist', 'autolink', 'lists', 'link', 'charmap', 'searchreplace', 'visualblocks', 'code', 'fullscreen', 'insertdatetime', 'table', 'wordcount'],
//                       toolbar: 'undo redo | formatselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | fontsize | removeformat | help',
//                       content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
//                       fontsize_formats: '8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt',
//                       branding: false,
//                       resize: false,
//                       statusbar: false,
//                     }}
//                   />
//                   <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
//                     <span>Word count: {editForm.wordCount}</span>
//                     <span>Changes will be saved as draft</span>
//                   </div>
//                 </div>
//               </div>
//               <div className="mt-6 flex justify-end space-x-3">
//                 <NewButton
//                   variant="outline"
//                   onClick={() => {
//                     setShowEditModal(false);
//                     setEditingSubmission(null);
//                     setEditForm({ title: "", content: "", wordCount: 0 });
//                     setEditError(null);
//                   }}
//                 >
//                   Cancel
//                 </NewButton>
//                 <NewButton
//                   variant="primary"
//                   onClick={handleEditSubmission}
//                   disabled={!editForm.title || !editForm.content || isEditing}
//                   icon={<Edit size={16} />}
//                 >
//                   {isEditing ? (
//                     <>
//                       <span className="mr-2">Saving...</span>
//                       <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                     </>
//                   ) : "Save Changes"}
//                 </NewButton>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {showContentModal && selectedSubmission && (
//         <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
//             <div className="p-6">
//               <div className="flex justify-between items-start mb-4">
//                 <div>
//                   <h3 className="text-xl font-bold mb-2">View Submission</h3>
//                   <p className="text-gray-600">{selectedSubmission.title} {selectedSubmission.name && `by ${selectedSubmission.name}`}</p>
//                 </div>
//                 <button
//                   onClick={() => {
//                     setShowContentModal(false);
//                     setSelectedSubmission(null);
//                   }}
//                   className="text-gray-500 hover:text-gray-700"
//                 >
//                   <X size={24} />
//                 </button>
//               </div>
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
//                   <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 max-h-96 overflow-y-auto">
//                     <div
//                       className="text-gray-700 leading-relaxed"
//                       dangerouslySetInnerHTML={{ __html: selectedSubmission.content }}
//                     />
//                   </div>
//                 </div>
//                 {selectedSubmission.wordCount && (
//                   <div className="text-sm text-gray-500">Word count: {selectedSubmission.wordCount}</div>
//                 )}
//               </div>
//               <div className="mt-6 flex justify-end space-x-3">
//                 <NewButton
//                   variant="outline"
//                   onClick={() => {
//                     setShowContentModal(false);
//                     setSelectedSubmission(null);
//                   }}
//                 >
//                   Close
//                 </NewButton>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {showDeleteModal && selectedSubmission && (
//         <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl max-w-md w-full shadow-2xl">
//             <div className="p-6">
//               <div className="flex items-center mb-4">
//                 <div className="bg-red-100 p-3 rounded-full mr-4">
//                   <Trash2 className="text-red-600" size={24} />
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-bold text-gray-900">Delete Submission</h3>
//                   <p className="text-gray-600">Are you sure you want to delete this submission?</p>
//                 </div>
//               </div>
//               <div className="bg-gray-50 p-4 rounded-lg mb-4">
//                 <h4 className="font-medium text-gray-900">{selectedSubmission.title}</h4>
//                 <p className="text-sm text-gray-600">Status: {selectedSubmission.status}</p>
//               </div>
//               {deleteError && (
//                 <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
//                   {deleteError}
//                 </div>
//               )}
//               <p className="text-sm text-red-600 mb-6">This action cannot be undone.</p>
//               <div className="flex justify-end space-x-3">
//                 <NewButton
//                   variant="outline"
//                   onClick={() => {
//                     setShowDeleteModal(false);
//                     setSelectedSubmission(null);
//                     setDeleteError(null);
//                   }}
//                 >
//                   Cancel
//                 </NewButton>
//                 <NewButton
//                   variant="danger"
//                   onClick={() => handleDeleteSubmission(selectedSubmission.id)}
//                   icon={<Trash2 size={16} />}
//                   disabled={isDeleting}
//                 >
//                   {isDeleting ? (
//                     <>
//                       <span className="mr-2">Deleting...</span>
//                       <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                     </>
//                   ) : "Delete"}
//                 </NewButton>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </section>
//   );
// };

// export default MyCompetitions;