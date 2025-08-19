import React, { useState, useEffect } from "react";
import { Trophy, Calendar, Users, Star, Plus, Eye, Filter, Pencil, Trash2 } from "lucide-react";
import CompetitionCreate from "../subPages/CompetitionCreate";
import CompetitionEdit from "../subPages/CompetitionEdit";
import axios from "axios";

const Competitions = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showEditEvent, setShowEditEvent] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [competitions, setCompetitions] = useState([]);
  const [imageStatus, setImageStatus] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dummy data for leaderboards and submissions (no endpoints provided)
  const leaderboards = [
    {
      competitionId: "1",
      title: "Winter Poetry Challenge",
      entries: [
        { rank: 1, author: "poet_sarah", title: "Frozen Dreams", votes: 234, score: 4.8 },
        { rank: 2, author: "verse_master", title: "Winter's Embrace", votes: 198, score: 4.6 },
        { rank: 3, author: "rhyme_time", title: "Snow Whispers", votes: 176, score: 4.5 },
        { rank: 4, author: "word_weaver", title: "Icy Reflections", votes: 145, score: 4.3 },
        { rank: 5, author: "poem_pilot", title: "Arctic Thoughts", votes: 132, score: 4.2 },
      ],
    },
  ];

  const submissions = [
    {
      id: 1,
      competitionId: "1",
      title: "Frozen Dreams",
      author: "poet_sarah",
      submissionDate: "2024-01-10",
      status: "approved",
      votes: 234,
      averageRating: 4.8,
      flagged: false,
    },
    {
      id: 2,
      competitionId: "1",
      title: "Winter Storm",
      author: "new_writer_123",
      submissionDate: "2024-01-12",
      status: "pending",
      votes: 0,
      averageRating: 0,
      flagged: true,
    },
    {
      id: 3,
      competitionId: "2",
      title: "The Last Library",
      author: "story_teller",
      submissionDate: "2024-01-18",
      status: "approved",
      votes: 45,
      averageRating: 4.2,
      flagged: false,
    },
  ];

  const baseUrl = "http://localhost:9090";

  // Fetch competitions from the database
  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get(`${baseUrl}/api/moderator/getAllCompetitions`);
        const fetchedCompetitions = response.data.map((comp) => ({
          id: comp.competitionId,
          title: comp.title,
          type: comp.theme || "Writing", // Default to "Writing" if theme is null
          startDate: new Date(comp.startDateTime).toISOString().split("T")[0],
          endDate: new Date(comp.endDateTime).toISOString().split("T")[0],
          participants: comp.currentParticipants || 0,
          submissions: 0, // No submission count in entity; set to 0
          status: comp.activeStatus
            ? new Date(comp.endDateTime) < new Date()
              ? "completed"
              : "active"
            : new Date(comp.startDateTime) > new Date()
            ? "upcoming"
            : "completed",
          votingStatus:
            comp.votingStartDateTime && comp.votingEndDateTime
              ? new Date(comp.votingStartDateTime) > new Date()
                ? "pending"
                : new Date(comp.votingEndDateTime) < new Date()
                ? "closed"
                : "open"
              : "pending",
          description: comp.description,
          bannerImage: comp.bannerImage, // Filename for lazy loading
          createdBy: comp.createdBy,
          entryTrustScore: comp.entryTrustScore,
          prizeTrustScore: comp.prizeTrustScore,
          maxParticipants: comp.maxParticipants,
          rules: comp.rules,
          judgingCriteria: comp.judgingCriteria,
        }));

        // Initialize image status for each competition
        const initialImageStatus = {};
        fetchedCompetitions.forEach((comp) => {
          initialImageStatus[comp.id] = comp.bannerImage
            ? { status: "loading", url: null, error: null }
            : { status: "missing", url: null, error: null };
        });
        setImageStatus(initialImageStatus);
        setCompetitions(fetchedCompetitions);
      } catch (err) {
        setError("Failed to fetch competitions: " + (err.response?.data?.message || err.message));
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompetitions();
  }, []);

  // Fetch banner images as base64
  useEffect(() => {
    const fetchBannerImages = async () => {
      for (const comp of competitions) {
        if (comp.bannerImage && imageStatus[comp.id]?.status === "loading") {
          try {
            const response = await axios.get(`${baseUrl}/getFileAsBase64`, {
              params: { fileName: comp.bannerImage, folderName: "bannerImage" },
            });
            setImageStatus((prev) => ({
              ...prev,
              [comp.id]: { status: "loaded", url: response.data, error: null },
            }));
          } catch (error) {
            setImageStatus((prev) => ({
              ...prev,
              [comp.id]: { status: "not_found", url: null, error: error.response?.data || error.message },
            }));
          }
        }
      }
    };

    fetchBannerImages();
  }, [competitions]);

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getVotingStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredCompetitions =
    statusFilter === "all"
      ? competitions
      : competitions.filter((comp) => comp.status === statusFilter);

  const handleCreateCompetition = (newCompetition) => {
    const formattedCompetition = {
      id: Date.now().toString(), // Temporary ID; ideally set by backend
      title: newCompetition.title,
      type: newCompetition.theme || "Writing",
      startDate: new Date(newCompetition.startDateTime).toISOString().split("T")[0],
      endDate: new Date(newCompetition.endDateTime).toISOString().split("T")[0],
      participants: newCompetition.currentParticipants || 0,
      submissions: 0,
      status: newCompetition.activeStatus
        ? new Date(newCompetition.endDateTime) < new Date()
          ? "completed"
          : "active"
        : new Date(newCompetition.startDateTime) > new Date()
        ? "upcoming"
        : "completed",
      votingStatus:
        newCompetition.votingStartDateTime && newCompetition.votingEndDateTime
          ? new Date(newCompetition.votingStartDateTime) > new Date()
            ? "pending"
            : new Date(newCompetition.votingEndDateTime) < new Date()
            ? "closed"
            : "open"
          : "pending",
      description: newCompetition.description,
      bannerImage: newCompetition.bannerImage?.name, // Use filename
      createdBy: newCompetition.createdBy,
      entryTrustScore: newCompetition.entryTrustScore,
      prizeTrustScore: newCompetition.prizeTrustScore,
      maxParticipants: newCompetition.maxParticipants,
      rules: newCompetition.rules,
      judgingCriteria: newCompetition.judgingCriteria,
    };
    setCompetitions((prev) => [...prev, formattedCompetition]);
    setImageStatus((prev) => ({
      ...prev,
      [formattedCompetition.id]: newCompetition.bannerImage
        ? { status: "loading", url: null, error: null }
        : { status: "missing", url: null, error: null },
    }));
  };

  const handleEditCompetition = (updatedCompetition) => {
    setCompetitions((prev) =>
      prev.map((comp) =>
        comp.id === updatedCompetition.id
          ? {
              ...updatedCompetition,
              startDate: new Date(updatedCompetition.startDateTime).toISOString().split("T")[0],
              endDate: new Date(updatedCompetition.endDateTime).toISOString().split("T")[0],
              type: updatedCompetition.theme || "Writing",
              status: updatedCompetition.activeStatus
                ? new Date(updatedCompetition.endDateTime) < new Date()
                  ? "completed"
                  : "active"
                : new Date(updatedCompetition.startDateTime) > new Date()
                ? "upcoming"
                : "completed",
              votingStatus:
                updatedCompetition.votingStartDateTime && updatedCompetition.votingEndDateTime
                  ? new Date(updatedCompetition.votingStartDateTime) > new Date()
                    ? "pending"
                    : new Date(updatedCompetition.votingEndDateTime) < new Date()
                    ? "closed"
                    : "open"
                  : "pending",
            }
          : comp
      )
    );
    setShowEditEvent(false);
    setSelectedCompetition(null);
  };

  const handleDeleteCompetition = (id) => {
    if (window.confirm("Are you sure you want to delete this competition?")) {
      setCompetitions((prev) => prev.filter((comp) => comp.id !== id));
      setImageStatus((prev) => {
        const newStatus = { ...prev };
        delete newStatus[id];
        return newStatus;
      });
    }
  };

  return (
    <div className="space-y-6 p-2 bg-gray-50 min-h-screen">
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-gray-600">Loading competitions...</span>
        </div>
      )}

      {/* Stats Cards */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Competitions</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {competitions.filter((c) => c.status === "active").length}
                </p>
              </div>
              <Trophy className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Participants</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {competitions.reduce((sum, c) => sum + c.participants, 0)}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Submissions</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {competitions.reduce((sum, c) => sum + c.submissions, 0)}
                </p>
              </div>
              <Star className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending Reviews</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">23</p>
              </div>
              <Eye className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      {!isLoading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex items-center justify-between px-6">
              <div className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab("active")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "active"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Active Competitions
                </button>
                <button
                  onClick={() => setActiveTab("leaderboards")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "leaderboards"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Leaderboards
                </button>
                <button
                  onClick={() => setActiveTab("submissions")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "submissions"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Submissions
                </button>
              </div>
              <div className="py-4">
                <button
                  onClick={() => setShowCreateEvent(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Event</span>
                </button>
              </div>
            </nav>
          </div>

          {/* Create Modal */}
          {showCreateEvent && (
            <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-lg relative p-6">
                <button
                  onClick={() => setShowCreateEvent(false)}
                  className="absolute top-4 right-4 text-gray-600 hover:text-red-600 text-xl font-bold"
                  aria-label="Close"
                >
                  &times;
                </button>
                <CompetitionCreate
                  setShowCreateEvent={setShowCreateEvent}
                  onCreate={handleCreateCompetition}
                />
              </div>
            </div>
          )}

          {/* Edit Modal */}
          {showEditEvent && selectedCompetition && (
            <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-lg relative p-6">
                <button
                  onClick={() => setShowEditEvent(false)}
                  className="absolute top-4 right-4 text-gray-600 hover:text-red-600 text-xl font-bold"
                  aria-label="Close"
                >
                  &times;
                </button>
                <CompetitionEdit
                  competition={selectedCompetition}
                  onUpdate={handleEditCompetition}
                  onCancel={() => setShowEditEvent(false)}
                />
              </div>
            </div>
          )}

          <div className="p-6">
            {activeTab === "active" && (
              <div>
                {/* Filter */}
                <div className="flex items-center space-x-4 mb-6">
                  <Filter className="w-5 h-5 text-gray-500" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Competitions</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="upcoming">Upcoming</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredCompetitions.map((competition) => (
                    <div
                      key={competition.id}
                      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {competition.title}
                          </h3>
                          <p className="text-gray-600 text-sm mt-1">
                            {competition.type}
                          </p>
                        </div>
                        <div className="flex flex-col space-y-1">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              competition.status
                            )}`}
                          >
                            {competition.status}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getVotingStatusColor(
                              competition.votingStatus
                            )}`}
                          >
                            voting {competition.votingStatus}
                          </span>
                        </div>
                      </div>

                      {/* Banner Image */}
                      <div className="mb-4">
                        {imageStatus[competition.id]?.status === "missing" ? (
                          <div className="w-full h-40 flex items-center justify-center bg-gray-100 rounded-md border border-gray-200 text-gray-500">
                            No Image Uploaded
                          </div>
                        ) : imageStatus[competition.id]?.status === "loading" ? (
                          <div className="w-full h-40 flex items-center justify-center bg-gray-100 rounded-md border border-gray-200 text-gray-500">
                            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <span className="ml-2">Loading...</span>
                          </div>
                        ) : imageStatus[competition.id]?.status === "not_found" ? (
                          <div className="w-full h-40 flex flex-col items-center justify-center bg-gray-100 rounded-md border border-gray-200 text-red-600">
                            <AlertCircle className="w-6 h-6 mb-2" />
                            <p>Image not found</p>
                          </div>
                        ) : (
                          <img
                            src={imageStatus[competition.id]?.url}
                            alt={competition.title}
                            className="w-full h-40 object-cover rounded-md border border-gray-200"
                            onError={() =>
                              setImageStatus((prev) => ({
                                ...prev,
                                [competition.id]: {
                                  status: "not_found",
                                  url: null,
                                  error: "Image failed to load",
                                },
                              }))
                            }
                            onLoad={() =>
                              setImageStatus((prev) => ({
                                ...prev,
                                [competition.id]: {
                                  ...prev[competition.id],
                                  status: "loaded",
                                  error: null,
                                },
                              }))
                            }
                          />
                        )}
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Duration:</span>
                          <span className="font-medium">
                            {competition.startDate} - {competition.endDate}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <p className="text-xl font-bold text-gray-900">
                              {competition.participants}
                            </p>
                            <p className="text-gray-600 text-sm">Participants</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xl font-bold text-blue-600">
                              {competition.submissions}
                            </p>
                            <p className="text-gray-600 text-sm">Submissions</p>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Description:
                        </p>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {competition.description}
                        </p>
                      </div>

                      <div className="flex justify-between items-center">
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </button>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedCompetition(competition);
                              setShowEditEvent(true);
                            }}
                            className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCompetition(competition.id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Delete
                          </button>
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Manage
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "leaderboards" && (
              <div className="space-y-6">
                {leaderboards.map((leaderboard) => (
                  <div
                    key={leaderboard.competitionId}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                  >
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {leaderboard.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Current standings based on community votes
                      </p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Rank
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Entry
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Author
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Votes
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Score
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {leaderboard.entries.map((entry) => (
                            <tr key={entry.rank} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <span
                                    className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                                      entry.rank === 1
                                        ? "bg-yellow-100 text-yellow-800"
                                        : entry.rank === 2
                                        ? "bg-gray-100 text-gray-800"
                                        : entry.rank === 3
                                        ? "bg-orange-100 text-orange-800"
                                        : "bg-blue-100 text-blue-800"
                                    }`}
                                  >
                                    {entry.rank}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {entry.title}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-600">
                                  {entry.author}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {entry.votes}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                                  <span className="text-sm text-gray-900">
                                    {entry.score}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button className="text-blue-600 hover:text-blue-800 mr-3">
                                  View
                                </button>
                                <button className="text-gray-600 hover:text-gray-900">
                                  Moderate
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "submissions" && (
              <div className="space-y-4">
                {submissions.map((submission) => (
                  <div
                    key={submission.id}
                    className={`p-6 rounded-lg ${
                      submission.flagged
                        ? "bg-red-50 border border-red-200"
                        : "bg-gray-50 border border-gray-200"
                    } hover:bg-gray-100 transition-colors`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {submission.title}
                          </h3>
                          <span className="text-gray-600 text-sm">
                            by {submission.author}
                          </span>
                          {submission.flagged && (
                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                              Flagged
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          Submitted: {submission.submissionDate} • Status: {submission.status} •
                          Votes: {submission.votes} • Rating: {submission.averageRating}
                        </p>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                          Review
                        </button>
                        {submission.status === "pending" && (
                          <>
                            <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors">
                              Approve
                            </button>
                            <button className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors">
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      <style jsx>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Competitions;

// import React, { useState } from "react";
// import { Trophy, Calendar, Users, Star, Plus, Eye, Filter, Pencil, Trash2 } from "lucide-react";
// import CompetitionCreate from "../subPages/CompetitionCreate";
// import CompetitionEdit from "../subPages/CompetitionEdit";

// const Competitions = () => {
//   const [activeTab, setActiveTab] = useState("active");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [showCreateEvent, setShowCreateEvent] = useState(false);
//   const [showEditEvent, setShowEditEvent] = useState(false);
//   const [selectedCompetition, setSelectedCompetition] = useState(null);

//   const [competitions, setCompetitions] = useState([
//     {
//       id: 1,
//       title: "Winter Poetry Challenge",
//       type: "Poetry",
//       startDate: "2024-01-01",
//       endDate: "2024-01-31",
//       participants: 87,
//       submissions: 156,
//       status: "active",
//       votingStatus: "open",
//       description:
//         "Express the beauty and melancholy of winter through poetry. Share your verses about snow, cold winds, cozy nights, and the quiet magic of the season.",
//     },
//     {
//       id: 2,
//       title: "Short Story Contest",
//       type: "Short Story",
//       startDate: "2024-01-15",
//       endDate: "2024-02-15",
//       participants: 45,
//       submissions: 67,
//       status: "active",
//       votingStatus: "pending",
//       description:
//         "Craft compelling short stories that captivate readers in under 2000 words. Any genre welcome - from mystery to romance to science fiction.",
//     },
//     {
//       id: 3,
//       title: "Book Review Excellence",
//       type: "Book Review",
//       startDate: "2023-12-01",
//       endDate: "2023-12-31",
//       participants: 123,
//       submissions: 245,
//       status: "completed",
//       votingStatus: "closed",
//       description:
//         "Write insightful and engaging book reviews that help fellow readers discover their next great read. Focus on both popular and hidden gems.",
//     },
//   ]);

//   const leaderboards = [
//     {
//       competitionId: 1,
//       title: "Winter Poetry Challenge",
//       entries: [
//         { rank: 1, author: "poet_sarah", title: "Frozen Dreams", votes: 234, score: 4.8 },
//         { rank: 2, author: "verse_master", title: "Winter's Embrace", votes: 198, score: 4.6 },
//         { rank: 3, author: "rhyme_time", title: "Snow Whispers", votes: 176, score: 4.5 },
//         { rank: 4, author: "word_weaver", title: "Icy Reflections", votes: 145, score: 4.3 },
//         { rank: 5, author: "poem_pilot", title: "Arctic Thoughts", votes: 132, score: 4.2 },
//       ],
//     },
//   ];

//   const submissions = [
//     {
//       id: 1,
//       competitionId: 1,
//       title: "Frozen Dreams",
//       author: "poet_sarah",
//       submissionDate: "2024-01-10",
//       status: "approved",
//       votes: 234,
//       averageRating: 4.8,
//       flagged: false,
//     },
//     {
//       id: 2,
//       competitionId: 1,
//       title: "Winter Storm",
//       author: "new_writer_123",
//       submissionDate: "2024-01-12",
//       status: "pending",
//       votes: 0,
//       averageRating: 0,
//       flagged: true,
//     },
//     {
//       id: 3,
//       competitionId: 2,
//       title: "The Last Library",
//       author: "story_teller",
//       submissionDate: "2024-01-18",
//       status: "approved",
//       votes: 45,
//       averageRating: 4.2,
//       flagged: false,
//     },
//   ];

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "active":
//         return "bg-green-100 text-green-800";
//       case "completed":
//         return "bg-gray-100 text-gray-800";
//       case "upcoming":
//         return "bg-blue-100 text-blue-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const getVotingStatusColor = (status) => {
//     switch (status) {
//       case "open":
//         return "bg-green-100 text-green-800";
//       case "closed":
//         return "bg-red-100 text-red-800";
//       case "pending":
//         return "bg-yellow-100 text-yellow-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const filteredCompetitions =
//     statusFilter === "all"
//       ? competitions
//       : competitions.filter((comp) => comp.status === statusFilter);

//   const handleCreateCompetition = (newCompetition) => {
//     setCompetitions((prev) => [...prev, { ...newCompetition, type: "Writing", submissions: 0, votingStatus: "pending" }]);
//   };

//   const handleEditCompetition = (updatedCompetition) => {
//     setCompetitions((prev) =>
//       prev.map((comp) => (comp.id === updatedCompetition.id ? updatedCompetition : comp))
//     );
//     setShowEditEvent(false);
//     setSelectedCompetition(null);
//   };

//   const handleDeleteCompetition = (id) => {
//     if (window.confirm("Are you sure you want to delete this competition?")) {
//       setCompetitions((prev) => prev.filter((comp) => comp.id !== id));
//     }
//   };

//   return (
//     <div className="space-y-6 p-2 bg-gray-50 min-h-screen">
//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-600 text-sm font-medium">Active Competitions</p>
//               <p className="text-2xl font-bold text-gray-900 mt-1">
//                 {competitions.filter((c) => c.status === "active").length}
//               </p>
//             </div>
//             <Trophy className="w-8 h-8 text-yellow-500" />
//           </div>
//         </div>
//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-600 text-sm font-medium">Total Participants</p>
//               <p className="text-2xl font-bold text-gray-900 mt-1">
//                 {competitions.reduce((sum, c) => sum + c.participants, 0)}
//               </p>
//             </div>
//             <Users className="w-8 h-8 text-blue-500" />
//           </div>
//         </div>
//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-600 text-sm font-medium">Submissions</p>
//               <p className="text-2xl font-bold text-gray-900 mt-1">
//                 {competitions.reduce((sum, c) => sum + c.submissions, 0)}
//               </p>
//             </div>
//             <Star className="w-8 h-8 text-purple-500" />
//           </div>
//         </div>
//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-600 text-sm font-medium">Pending Reviews</p>
//               <p className="text-2xl font-bold text-gray-900 mt-1">23</p>
//             </div>
//             <Eye className="w-8 h-8 text-green-500" />
//           </div>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200">
//         <div className="border-b border-gray-200">
//           <nav className="flex items-center justify-between px-6">
//             <div className="-mb-px flex space-x-8">
//               <button
//                 onClick={() => setActiveTab("active")}
//                 className={`py-4 px-1 border-b-2 font-medium text-sm ${
//                   activeTab === "active" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                 }`}
//               >
//                 Active Competitions
//               </button>
//               <button
//                 onClick={() => setActiveTab("leaderboards")}
//                 className={`py-4 px-1 border-b-2 font-medium text-sm ${
//                   activeTab === "leaderboards" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                 }`}
//               >
//                 Leaderboards
//               </button>
//               <button
//                 onClick={() => setActiveTab("submissions")}
//                 className={`py-4 px-1 border-b-2 font-medium text-sm ${
//                   activeTab === "submissions" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                 }`}
//               >
//                 Submissions
//               </button>
//             </div>
//             <div className="py-4">
//               <button
//                 onClick={() => setShowCreateEvent(true)}
//                 className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
//               >
//                 <Plus className="w-4 h-4" />
//                 <span>Create Event</span>
//               </button>
//             </div>
//           </nav>
//         </div>

//         {/* Create Modal */}
//         {showCreateEvent && (
//           <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
//             <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-lg relative p-6">
//               <button
//                 onClick={() => setShowCreateEvent(false)}
//                 className="absolute top-4 right-4 text-gray-600 hover:text-red-600 text-xl font-bold"
//                 aria-label="Close"
//               >
//                 &times;
//               </button>
//               <CompetitionCreate
//                 setShowCreateEvent={setShowCreateEvent}
//                 onCreate={handleCreateCompetition}
//               />
//             </div>
//           </div>
//         )}

//         {/* Edit Modal */}
//         {showEditEvent && selectedCompetition && (
//           <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
//             <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-lg relative p-6">
//               <button
//                 onClick={() => setShowEditEvent(false)}
//                 className="absolute top-4 right-4 text-gray-600 hover:text-red-600 text-xl font-bold"
//                 aria-label="Close"
//               >
//                 &times;
//               </button>
//               <CompetitionEdit
//                 competition={selectedCompetition}
//                 onUpdate={handleEditCompetition}
//                 onCancel={() => setShowEditEvent(false)}
//               />
//             </div>
//           </div>
//         )}

//         <div className="p-6">
//           {activeTab === "active" && (
//             <div>
//               {/* Filter */}
//               <div className="flex items-center space-x-4 mb-6">
//                 <Filter className="w-5 h-5 text-gray-500" />
//                 <select
//                   value={statusFilter}
//                   onChange={(e) => setStatusFilter(e.target.value)}
//                   className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 >
//                   <option value="all">All Competitions</option>
//                   <option value="active">Active</option>
//                   <option value="completed">Completed</option>
//                   <option value="upcoming">Upcoming</option>
//                 </select>
//               </div>

//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 {filteredCompetitions.map((competition) => (
//                   <div
//                     key={competition.id}
//                     className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
//                   >
//                     <div className="flex items-start justify-between mb-4">
//                       <div>
//                         <h3 className="text-lg font-semibold text-gray-900">
//                           {competition.title}
//                         </h3>
//                         <p className="text-gray-600 text-sm mt-1">
//                           {competition.type}
//                         </p>
//                       </div>
//                       <div className="flex flex-col space-y-1">
//                         <span
//                           className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
//                             competition.status
//                           )}`}
//                         >
//                           {competition.status}
//                         </span>
//                         <span
//                           className={`px-2 py-1 rounded-full text-xs font-medium ${getVotingStatusColor(
//                             competition.votingStatus
//                           )}`}
//                         >
//                           voting {competition.votingStatus}
//                         </span>
//                       </div>
//                     </div>

//                     <div className="space-y-3 mb-4">
//                       <div className="flex items-center justify-between text-sm">
//                         <span className="text-gray-600">Duration:</span>
//                         <span className="font-medium">
//                           {competition.startDate} - {competition.endDate}
//                         </span>
//                       </div>
//                       <div className="grid grid-cols-2 gap-4">
//                         <div className="text-center">
//                           <p className="text-xl font-bold text-gray-900">
//                             {competition.participants}
//                           </p>
//                           <p className="text-gray-600 text-sm">Participants</p>
//                         </div>
//                         <div className="text-center">
//                           <p className="text-xl font-bold text-blue-600">
//                             {competition.submissions}
//                           </p>
//                           <p className="text-gray-600 text-sm">Submissions</p>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="mb-4">
//                       <p className="text-sm font-medium text-gray-700 mb-2">
//                         Description:
//                       </p>
//                       <p className="text-sm text-gray-600 leading-relaxed">
//                         {competition.description}
//                       </p>
//                     </div>

//                     <div className="flex justify-between items-center">
//                       <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
//                         <Eye className="w-4 h-4 mr-1" />
//                         View Details
//                       </button>
//                       <div className="flex space-x-2">
//                         <button
//                           onClick={() => {
//                             setSelectedCompetition(competition);
//                             setShowEditEvent(true);
//                           }}
//                           className="text-gray-600 hover:text-gray-900 text-sm font-medium"
//                         >
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => handleDeleteCompetition(competition.id)}
//                           className="text-red-600 hover:text-red-800 text-sm font-medium"
//                         >
//                           Delete
//                         </button>
//                         <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
//                           Manage
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {activeTab === "leaderboards" && (
//             <div className="space-y-6">
//               {leaderboards.map((leaderboard) => (
//                 <div
//                   key={leaderboard.competitionId}
//                   className="bg-white rounded-lg border border-gray-200 overflow-hidden"
//                 >
//                   <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
//                     <h3 className="text-lg font-semibold text-gray-900">
//                       {leaderboard.title}
//                     </h3>
//                     <p className="text-gray-600 text-sm">
//                       Current standings based on community votes
//                     </p>
//                   </div>
//                   <div className="overflow-x-auto">
//                     <table className="min-w-full divide-y divide-gray-200">
//                       <thead className="bg-gray-50">
//                         <tr>
//                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Rank
//                           </th>
//                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Entry
//                           </th>
//                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Author
//                           </th>
//                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Votes
//                           </th>
//                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Score
//                           </th>
//                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Actions
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody className="bg-white divide-y divide-gray-200">
//                         {leaderboard.entries.map((entry) => (
//                           <tr key={entry.rank} className="hover:bg-gray-50">
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               <div className="flex items-center">
//                                 <span
//                                   className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
//                                     entry.rank === 1
//                                       ? "bg-yellow-100 text-yellow-800"
//                                       : entry.rank === 2
//                                       ? "bg-gray-100 text-gray-800"
//                                       : entry.rank === 3
//                                       ? "bg-orange-100 text-orange-800"
//                                       : "bg-blue-100 text-blue-800"
//                                   }`}
//                                 >
//                                   {entry.rank}
//                                 </span>
//                               </div>
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               <div className="text-sm font-medium text-gray-900">
//                                 {entry.title}
//                               </div>
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               <div className="text-sm text-gray-600">
//                                 {entry.author}
//                               </div>
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               <div className="text-sm text-gray-900">
//                                 {entry.votes}
//                               </div>
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               <div className="flex items-center">
//                                 <Star className="w-4 h-4 text-yellow-400 mr-1" />
//                                 <span className="text-sm text-gray-900">
//                                   {entry.score}
//                                 </span>
//                               </div>
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                               <button className="text-blue-600 hover:text-blue-800 mr-3">
//                                 View
//                               </button>
//                               <button className="text-gray-600 hover:text-gray-900">
//                                 Moderate
//                               </button>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           {activeTab === "submissions" && (
//             <div className="space-y-4">
//               {submissions.map((submission) => (
//                 <div
//                   key={submission.id}
//                   className={`p-6 rounded-lg ${
//                     submission.flagged
//                       ? "bg-red-50 border border-red-200"
//                       : "bg-gray-50 border border-gray-200"
//                   } hover:bg-gray-100 transition-colors`}
//                 >
//                   <div className="flex items-start justify-between">
//                     <div className="flex-1">
//                       <div className="flex items-center space-x-3 mb-2">
//                         <h3 className="text-lg font-semibold text-gray-900">
//                           {submission.title}
//                         </h3>
//                         <span className="text-gray-600 text-sm">
//                           by {submission.author}
//                         </span>
//                         {submission.flagged && (
//                           <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
//                             Flagged
//                           </span>
//                         )}
//                       </div>
//                       <p className="text-sm text-gray-600 mb-3">
//                         Submitted: {submission.submissionDate} • Status:{" "}
//                         {submission.status} • Votes: {submission.votes} •
//                         Rating: {submission.averageRating}
//                       </p>
//                     </div>
//                     <div className="flex space-x-2 ml-4">
//                       <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
//                         Review
//                       </button>
//                       {submission.status === "pending" && (
//                         <>
//                           <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors">
//                             Approve
//                           </button>
//                           <button className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors">
//                             Reject
//                           </button>
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Competitions;