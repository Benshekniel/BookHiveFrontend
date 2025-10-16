import React, { useState, useEffect } from "react";
import { Trophy, Calendar, Star, Send, Search } from "lucide-react";
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

const NewCompetitions = ({ competitions, openSubmissionModal, isDeadlinePassed, userParticipatedCompetitions }) => {
  const { trustScore, isLoading: trustScoreLoading } = useTrustScore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [participationStatus, setParticipationStatus] = useState({});
  const baseUrl = "http://localhost:9090";

  const filteredCompetitions = competitions.filter((competition) => {
    const matchesSearch =
      competition.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      competition.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || competition.category === selectedCategory;
    const matchesStatus =
      !selectedStatus ||
      (selectedStatus === "Active" && !isDeadlinePassed(competition.deadline) && competition.participants < competition.maxParticipants) ||
      (selectedStatus === "Ending Soon" && competition.featured && !isDeadlinePassed(competition.deadline));
    const notParticipated = !userParticipatedCompetitions.includes(competition.id);
    return matchesSearch && matchesCategory && matchesStatus && notParticipated;
  });

  const handleParticipate = async (competitionId) => {
    setIsLoading(true);
    setError(null);
    setParticipationStatus((prev) => ({ ...prev, [competitionId]: { loading: true, error: null } }));

    try {
      const response = await axios.post(
        `${baseUrl}/api/insertParticipantEmail`,
        null,
        {
          params: { competitionId, email: "user@example.com" },
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const result = response.data;
      if (result.message === "insert_success") {
        setParticipationStatus((prev) => ({
          ...prev,
          [competitionId]: { loading: false, success: true, error: null },
        }));
      } else {
        setParticipationStatus((prev) => ({
          ...prev,
          [competitionId]: { loading: false, success: false, error: result.error || "Failed to join competition" },
        }));
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message;
      setParticipationStatus((prev) => ({
        ...prev,
        [competitionId]: { loading: false, success: false, error: errorMessage },
      }));
    } finally {
      setIsLoading(false);
    }
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
          <option value="Writing">Writing</option>
        </select>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Ending Soon">Ending Soon</option>
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
            const canParticipate = trustScore >= (competition.trustScoreRequirement || 0);
            const trustScoreShortfall = competition.trustScoreRequirement - trustScore;
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
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="mr-2" size={16} />
                      <span>Trust Score Required: {competition.trustScoreRequirement || 0}</span>
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
                        onClick={() => openSubmissionModal(competition)}
                      >
                        View Details
                      </NewButton>
                      {!isDeadlinePassed(competition.deadline) && (
                        <div className="relative">
                          <NewButton
                            variant={canParticipate ? "success" : "danger"}
                            size="sm"
                            onClick={() => canParticipate && handleParticipate(competition.id)}
                            icon={<Send size={14} />}
                            disabled={participationStatus[competition.id]?.loading || participationStatus[competition.id]?.success}
                          >
                            {participationStatus[competition.id]?.loading
                              ? "Joining..."
                              : participationStatus[competition.id]?.success
                              ? "Joined"
                              : "Join Competition"}
                          </NewButton>
                          {!canParticipate && (
                            <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                              You need {trustScoreShortfall} more trust score points to participate.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  {participationStatus[competition.id]?.error && (
                    <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                      {participationStatus[competition.id].error}
                    </div>
                  )}
                  {participationStatus[competition.id]?.success && (
                    <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
                      Successfully joined the competition!
                    </div>
                  )}
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
            );
          })}
        </div>
      )}
    </section>
  );
};

export default NewCompetitions;