import React, { useState, useEffect } from "react";
import { Trophy, Calendar, Users, Star, Plus, Eye, Filter, Pencil, Trash2, AlertCircle, X } from "lucide-react";
import CompetitionCreate from "../subPages/CompetitionCreate";
import CompetitionEdit from "../subPages/CompetitionEdit";
import CompetitionDetails from "../subPages/CompetitionDetails";
import axios from "axios";
import { useAuth } from '../../../components/AuthContext';

const Competitions = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("active");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreatedByMe, setShowCreatedByMe] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showEditEvent, setShowEditEvent] = useState(false);
  const [showDetailsEvent, setShowDetailsEvent] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [competitions, setCompetitions] = useState([]);
  const [imageStatus, setImageStatus] = useState({});
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const baseUrl = "http://localhost:9090";

  // Utility function to safely parse dates
  const parseDate = (dateStr) => {
    if (!dateStr || typeof dateStr !== "string") return null;
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  };

  // Format date to yyyy-MM-dd or return empty string
  const formatDateForDisplay = (dateStr) => {
    const date = parseDate(dateStr);
    return date ? date.toISOString().split("T")[0] : "";
  };

  // Fetch competitions from the database
  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get(`${baseUrl}/api/moderator/getAllCompetitions`);
        console.log("Fetched competitions:", response.data);

        const fetchedCompetitions = response.data.map((comp) => {
          const startDate = parseDate(comp.startdatetime);
          const endDate = parseDate(comp.enddatetime);
          const votingStartDate = parseDate(comp.votingstartdatetime);
          const votingEndDate = parseDate(comp.votingenddatetime);
          const now = new Date();

          return {
            id: comp.competitionid,
            title: comp.title || "Untitled",
            type: comp.theme || "Writing",
            startDate: formatDateForDisplay(comp.startdatetime),
            endDate: formatDateForDisplay(comp.enddatetime),
            votingEndDate: formatDateForDisplay(comp.votingenddatetime),
            participants: comp.currentparticipants || 0,
            submissions: 0,
            dateStatus: startDate && endDate
              ? startDate > now
                ? "upcoming"
                : endDate < now
                ? "finished"
                : "ongoing"
              : "finished",
            activeStatus: comp.activestatus || false,
            pauseStatus: comp.pausestatus !== null ? comp.pausestatus : true, // Set null to paused
            activatedAt: comp.activatedat || null,
            votingStatus: votingStartDate && votingEndDate
              ? votingStartDate > now
                ? "upcoming"
                : votingEndDate < now
                ? "finished"
                : "ongoing"
              : "pending",
            description: comp.description || "No description",
            bannerImage: comp.bannerimage,
            createdBy: comp.createdby,
            entryTrustScore: comp.entrytrustscore,
            prizeTrustScore: comp.prizetrustscore,
            maxParticipants: comp.maxparticipants,
            rules: comp.rules ? JSON.parse(comp.rules) : [],
            judgingCriteria: comp.judgingcriteria ? JSON.parse(comp.judgingcriteria) : [],
            participantEmails: comp.participantemails ? JSON.parse(comp.participantemails) : [],
            startDateTime: comp.startdatetime || "",
            endDateTime: comp.enddatetime || "",
            votingStartDateTime: comp.votingstartdatetime || "",
            votingEndDateTime: comp.votingenddatetime || "",
          };
        });

        console.log("Mapped competitions:", fetchedCompetitions);

        const initialImageStatus = {};
        fetchedCompetitions.forEach((comp) => {
          initialImageStatus[comp.id] = comp.bannerImage
            ? { status: "loading", url: null, error: null }
            : { status: "missing", url: null, error: null };
        });
        setImageStatus(initialImageStatus);
        setCompetitions(fetchedCompetitions);
      } catch (err) {
        const errorMessage = "Failed to fetch competitions: " + (err.response?.data?.message || err.message);
        console.error("Fetch error:", err);
        setError(errorMessage);
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
          console.log(`Fetching base64 for competition ${comp.id}: fileName=${comp.bannerImage}, folderName=competitions`);
          try {
            const response = await axios.get(`${baseUrl}/getFileAsBase64`, {
              params: { fileName: comp.bannerImage, folderName: "competitions" },
            });
            console.log(`Response for ${comp.id}:`, response.data.substring(0, 50) + '...');
            setImageStatus((prev) => ({
              ...prev,
              [comp.id]: { status: "loaded", url: response.data, error: null },
            }));
          } catch (error) {
            console.error(`Error fetching base64 for ${comp.id}:`, error.response?.data || error.message);
            setImageStatus((prev) => ({
              ...prev,
              [comp.id]: { status: "not_found", url: null, error: error.response?.data || error.message },
            }));
          }
        } else {
          console.log(`No fileName for ${comp.id}, marking as missing`);
        }
      }
    };

    fetchBannerImages();
  }, [competitions]);

  const getStatusColor = (status) => {
    switch (status) {
      case "ongoing":
        return "bg-green-100 text-green-800";
      case "finished":
        return "bg-gray-100 text-gray-800";
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getVotingStatusColor = (status) => {
    switch (status) {
      case "ongoing":
        return "bg-green-100 text-green-800";
      case "finished":
        return "bg-red-100 text-red-800";
      case "upcoming":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getActiveStatusColor = (active) => {
    return active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const getPauseStatusColor = (paused) => {
    return paused ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800";
  };

  // This function is no longer needed - competitionCreate.jsx handles the API call
  // We just need a placeholder since it's still referenced in the JSX
  const handleCreateCompetition = () => {
    // CompetitionCreate component handles everything now
    // It will reload the page after successful creation
  };

  const handleEditCompetition = (updatedCompetition) => {
    setCompetitions((prev) =>
      prev.map((comp) =>
        comp.id === updatedCompetition.id
          ? {
              ...updatedCompetition,
              startDate: formatDateForDisplay(updatedCompetition.startDateTime),
              endDate: formatDateForDisplay(updatedCompetition.endDateTime),
              votingEndDate: formatDateForDisplay(updatedCompetition.votingEndDateTime),
              type: updatedCompetition.theme || "Writing",
              dateStatus: updatedCompetition.startDateTime && updatedCompetition.endDateTime
                ? new Date(updatedCompetition.startDateTime) > new Date()
                  ? "upcoming"
                  : new Date(updatedCompetition.endDateTime) < new Date()
                  ? "finished"
                  : "ongoing"
                : "finished",
              activeStatus: updatedCompetition.activeStatus || false,
              pauseStatus: updatedCompetition.pausestatus !== null ? updatedCompetition.pausestatus : true, // Set null to paused
              activatedAt: updatedCompetition.activatedAt || null,
              votingStatus: updatedCompetition.votingStartDateTime && updatedCompetition.votingEndDateTime
                ? new Date(updatedCompetition.votingStartDateTime) > new Date()
                  ? "upcoming"
                  : new Date(updatedCompetition.votingEndDateTime) < new Date()
                  ? "finished"
                  : "ongoing"
                : "pending",
              participantEmails: updatedCompetition.participantEmails || [],
              startDateTime: updatedCompetition.startDateTime || "",
              endDateTime: updatedCompetition.endDateTime || "",
              votingStartDateTime: updatedCompetition.votingStartDateTime || "",
              votingEndDateTime: updatedCompetition.votingEndDateTime || "",
            }
          : comp
      )
    );
    setShowEditEvent(false);
    setSelectedCompetition(null);
  };

  const handleDeleteCompetition = async (id) => {
    if (window.confirm("Are you sure you want to delete this competition?")) {
      try {
        await axios.delete(`${baseUrl}/api/moderator/deleteCompetition/${id}`);
        setCompetitions((prev) => prev.filter((comp) => comp.id !== id));
        setImageStatus((prev) => {
          const newStatus = { ...prev };
          delete newStatus[id];
          return newStatus;
        });
      } catch (error) {
        console.error("Error deleting competition:", error);
        setError("Failed to delete competition: " + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleGoLive = async (id) => {
    try {
      const response = await axios.get(`${baseUrl}/api/moderator/goLiveCompetition`, {
        params: { competitionId: id, email: user.email },
      });
      if (response.data.message === "success") {
        setCompetitions((prev) =>
          prev.map((comp) =>
            comp.id === id
              ? { ...comp, activeStatus: true, activatedAt: new Date().toISOString() }
              : comp
          )
        );
      } else {
        setError("Failed to go live: " + response.data.message);
      }
    } catch (error) {
      setError("Failed to go live: " + (error.response?.data?.message || error.message));
    }
  };

  const handleReLive = async (id) => {
    try {
      const response = await axios.get(`${baseUrl}/api/moderator/reLiveCompetition`, {
        params: { competitionId: id, email: user.email },
      });
      if (response.data.message === "success") {
        setCompetitions((prev) =>
          prev.map((comp) =>
            comp.id === id
              ? { ...comp, activeStatus: true }
              : comp
          )
        );
      } else {
        setError("Failed to relive: " + response.data.message);
      }
    } catch (error) {
      setError("Failed to relive: " + (error.response?.data?.message || error.message));
    }
  };

  const handleStopLive = async (id) => {
    try {
      const response = await axios.get(`${baseUrl}/api/moderator/stopLiveCompetition`, {
        params: { competitionId: id, email: user.email },
      });
      if (response.data.message === "success") {
        setCompetitions((prev) =>
          prev.map((comp) =>
            comp.id === id
              ? { ...comp, activeStatus: false }
              : comp
          )
        );
      } else {
        setError("Failed to stop live: " + response.data.message);
      }
    } catch (error) {
      setError("Failed to stop live: " + (error.response?.data?.message || error.message));
    }
  };

  const handlePause = async (id) => {
    try {
      const response = await axios.get(`${baseUrl}/api/moderator/pauseCompetition`, {
        params: { competitionId: id, email: user.email },
      });
      if (response.data.message === "success") {
        setCompetitions((prev) =>
          prev.map((comp) =>
            comp.id === id
              ? { ...comp, pauseStatus: true }
              : comp
          )
        );
      } else {
        setError("Failed to pause: " + response.data.message);
      }
    } catch (error) {
      setError("Failed to pause: " + (error.response?.data?.message || error.message));
    }
  };

  const handleResume = async (id) => {
    try {
      const response = await axios.get(`${baseUrl}/api/moderator/resumeCompetition`, {
        params: { competitionId: id, email: user.email },
      });
      if (response.data.message === "success") {
        setCompetitions((prev) =>
          prev.map((comp) =>
            comp.id === id
              ? { ...comp, pauseStatus: false }
              : comp
          )
        );
      } else {
        setError("Failed to resume: " + response.data.message);
      }
    } catch (error) {
      setError("Failed to resume: " + (error.response?.data?.message || error.message));
    }
  };

  const handleImageClick = (src) => {
    setEnlargedImage(src);
  };

  const handleCloseEnlarged = () => {
    setEnlargedImage(null);
  };

  const handleViewDetails = (competition) => {
    setSelectedCompetition(competition);
    setShowDetailsEvent(true);
  };

  // Combined filtering logic
  const filteredCompetitions = competitions.filter((comp) =>
    showCreatedByMe
      ? comp.createdBy === user.email && (statusFilter === "all" || comp.dateStatus === statusFilter)
      : statusFilter === "all" || comp.dateStatus === statusFilter
  );

  // Dummy data for leaderboards and submissions
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

  return (
    <div className="space-y-6 p-4 bg-gray-50 min-h-screen">
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
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

      {/* No Competitions Message */}
      {!isLoading && competitions.length === 0 && (
        <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-600 text-lg">No competitions found. Create a new one to get started!</p>
          <button
            onClick={() => setShowCreateEvent(true)}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 mx-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Event</span>
          </button>
        </div>
      )}

      {/* Stats Cards */}
      {!isLoading && competitions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Ongoing Competitions</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {competitions.filter((c) => c.dateStatus === "ongoing").length}
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
                <p className="text-gray-600 text-sm font-medium">Upcoming Competitions</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {competitions.filter((c) => c.dateStatus === "upcoming").length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      {!isLoading && competitions.length > 0 && (
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
              <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-lg p-6">
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

          {/* Details Modal */}
          {showDetailsEvent && selectedCompetition && (
            <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-lg p-6">
                <CompetitionDetails
                  competition={selectedCompetition}
                  currentUserEmail={user.email}
                  closeModal={() => setShowDetailsEvent(false)}
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
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="finished">Finished</option>
                  </select>
                  <button
                    onClick={() => setShowCreatedByMe(!showCreatedByMe)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      showCreatedByMe ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
                    } hover:opacity-90 transition-opacity`}
                  >
                    Created By Me
                  </button>
                </div>

                {filteredCompetitions.length === 0 && (
                  <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
                    <p className="text-gray-600 text-lg">
                      No {statusFilter === "all" ? "" : statusFilter} competitions found.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredCompetitions.map((competition) => (
                    <div
                      key={competition.id}
                      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {competition.title}
                        </h3>
                        <div className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                          Created by: {competition.createdBy === user.email ? "You" : competition.createdBy}
                        </div>
                      </div>

                      <div className="flex items-start justify-between mb-4">
                        <p className="text-gray-600 text-sm">
                          {competition.type}
                        </p>
                        <div className="flex flex-col space-y-1">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              competition.dateStatus
                            )}`}
                          >
                            {competition.dateStatus}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getVotingStatusColor(
                              competition.votingStatus
                            )}`}
                          >
                            Voting {competition.votingStatus}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getActiveStatusColor(
                              competition.activeStatus
                            )}`}
                          >
                            {competition.activeStatus ? "Active" : "Inactive"}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getPauseStatusColor(
                              competition.pauseStatus
                            )}`}
                          >
                            {competition.pauseStatus ? "Paused" : "On Play"}
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
                            <p>Image not found: {imageStatus[competition.id]?.error}</p>
                          </div>
                        ) : (
                          <img
                            src={imageStatus[competition.id]?.url}
                            alt={competition.title}
                            className="w-full h-40 object-cover rounded-md border border-gray-200 cursor-pointer"
                            onClick={() => handleImageClick(imageStatus[competition.id]?.url)}
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
                            {competition.startDate || "Not set"} - {competition.votingEndDate || "Not set"}
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
                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                          {competition.description}
                        </p>
                      </div>

                      <div className="flex justify-between items-center">
                        <button
                          onClick={() => handleViewDetails(competition)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </button>
                        <div className="flex space-x-2">
                          {competition.createdBy === user.email && (
                            <>
                              {!competition.activatedAt && !competition.activeStatus ? (
                                <button
                                  onClick={() => handleGoLive(competition.id)}
                                  className="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded text-sm font-medium transition-colors"
                                >
                                  Go Live
                                </button>
                              ) : competition.activeStatus ? (
                                <button
                                  onClick={() => handleStopLive(competition.id)}
                                  className="bg-orange-600 hover:bg-orange-700 text-white px-2 py-1 rounded text-sm font-medium transition-colors"
                                >
                                  Stop Live
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleReLive(competition.id)}
                                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-1 rounded text-sm font-medium transition-colors"
                                >
                                  ReLive
                                </button>
                              )}
                              {!competition.pauseStatus ? (
                                <button
                                  onClick={() => handlePause(competition.id)}
                                  className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-sm font-medium transition-colors"
                                >
                                  Pause
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleResume(competition.id)}
                                  className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-sm font-medium transition-colors"
                                >
                                  Resume
                                </button>
                              )}
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
                            </>
                          )}
                          {competition.createdBy !== user.email && (
                            <>
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
                            </>
                          )}
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

      {/* Enlarged Image Modal */}
      {enlargedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-60">
          <div className="relative max-w-4xl w-full m-4">
            <button
              onClick={handleCloseEnlarged}
              className="absolute top-2 right-2 p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={enlargedImage}
              alt="Enlarged Image"
              className="w-full h-auto max-h-[80vh] object-contain rounded-md"
            />
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
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Competitions;

// import React, { useState, useEffect } from "react";
// import { Trophy, Calendar, Users, Star, Plus, Eye, Filter, Pencil, Trash2, AlertCircle, X } from "lucide-react";
// import CompetitionCreate from "../subPages/CompetitionCreate";
// import CompetitionEdit from "../subPages/CompetitionEdit";
// import CompetitionDetails from "../subPages/CompetitionDetails";
// import axios from "axios";
// import { useAuth } from '../../../components/AuthContext';

// const Competitions = () => {
//   const { user } = useAuth();
//   const [activeTab, setActiveTab] = useState("active");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [showCreatedByMe, setShowCreatedByMe] = useState(false);
//   const [showCreateEvent, setShowCreateEvent] = useState(false);
//   const [showEditEvent, setShowEditEvent] = useState(false);
//   const [showDetailsEvent, setShowDetailsEvent] = useState(false);
//   const [selectedCompetition, setSelectedCompetition] = useState(null);
//   const [competitions, setCompetitions] = useState([]);
//   const [imageStatus, setImageStatus] = useState({});
//   const [enlargedImage, setEnlargedImage] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const baseUrl = "http://localhost:9090";

//   // Utility function to safely parse dates
//   const parseDate = (dateStr) => {
//     if (!dateStr || typeof dateStr !== "string") return null;
//     const date = new Date(dateStr);
//     return isNaN(date.getTime()) ? null : date;
//   };

//   // Format date to yyyy-MM-dd or return empty string
//   const formatDateForDisplay = (dateStr) => {
//     const date = parseDate(dateStr);
//     return date ? date.toISOString().split("T")[0] : "";
//   };

//   // Fetch competitions from the database
//   useEffect(() => {
//     const fetchCompetitions = async () => {
//       try {
//         setIsLoading(true);
//         setError(null);
//         const response = await axios.get(`${baseUrl}/api/moderator/getAllCompetitions`);
//         console.log("Fetched competitions:", response.data);

//         const fetchedCompetitions = response.data.map((comp) => {
//           const startDate = parseDate(comp.startdatetime);
//           const endDate = parseDate(comp.enddatetime);
//           const votingStartDate = parseDate(comp.votingstartdatetime);
//           const votingEndDate = parseDate(comp.votingenddatetime);
//           const now = new Date();

//           return {
//             id: comp.competitionid,
//             title: comp.title || "Untitled",
//             type: comp.theme || "Writing",
//             startDate: formatDateForDisplay(comp.startdatetime),
//             endDate: formatDateForDisplay(comp.enddatetime),
//             votingEndDate: formatDateForDisplay(comp.votingenddatetime),
//             participants: comp.currentparticipants || 0,
//             submissions: 0,
//             dateStatus: startDate && endDate
//               ? startDate > now
//                 ? "upcoming"
//                 : endDate < now
//                 ? "finished"
//                 : "ongoing"
//               : "finished",
//             activeStatus: comp.activestatus || false,
//             votingStatus: votingStartDate && votingEndDate
//               ? votingStartDate > now
//                 ? "upcoming"
//                 : votingEndDate < now
//                 ? "finished"
//                 : "ongoing"
//               : "pending",
//             description: comp.description || "No description",
//             bannerImage: comp.bannerimage,
//             createdBy: comp.createdby,
//             entryTrustScore: comp.entrytrustscore,
//             prizeTrustScore: comp.prizetrustscore,
//             maxParticipants: comp.maxparticipants,
//             rules: comp.rules ? JSON.parse(comp.rules) : [],
//             judgingCriteria: comp.judgingcriteria ? JSON.parse(comp.judgingcriteria) : [],
//             participantEmails: comp.participantemails ? JSON.parse(comp.participantemails) : [],
//             startDateTime: comp.startdatetime || "",
//             endDateTime: comp.enddatetime || "",
//             votingStartDateTime: comp.votingstartdatetime || "",
//             votingEndDateTime: comp.votingenddatetime || "",
//           };
//         });

//         console.log("Mapped competitions:", fetchedCompetitions);

//         const initialImageStatus = {};
//         fetchedCompetitions.forEach((comp) => {
//           initialImageStatus[comp.id] = comp.bannerImage
//             ? { status: "loading", url: null, error: null }
//             : { status: "missing", url: null, error: null };
//         });
//         setImageStatus(initialImageStatus);
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

//   // Fetch banner images as base64
//   useEffect(() => {
//     const fetchBannerImages = async () => {
//       for (const comp of competitions) {
//         if (comp.bannerImage && imageStatus[comp.id]?.status === "loading") {
//           console.log(`Fetching base64 for competition ${comp.id}: fileName=${comp.bannerImage}, folderName=competitions`);
//           try {
//             const response = await axios.get(`${baseUrl}/getFileAsBase64`, {
//               params: { fileName: comp.bannerImage, folderName: "competitions" },
//             });
//             console.log(`Response for ${comp.id}:`, response.data.substring(0, 50) + '...');
//             setImageStatus((prev) => ({
//               ...prev,
//               [comp.id]: { status: "loaded", url: response.data, error: null },
//             }));
//           } catch (error) {
//             console.error(`Error fetching base64 for ${comp.id}:`, error.response?.data || error.message);
//             setImageStatus((prev) => ({
//               ...prev,
//               [comp.id]: { status: "not_found", url: null, error: error.response?.data || error.message },
//             }));
//           }
//         } else {
//           console.log(`No fileName for ${comp.id}, marking as missing`);
//         }
//       }
//     };

//     fetchBannerImages();
//   }, [competitions]);

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "ongoing":
//         return "bg-green-100 text-green-800";
//       case "finished":
//         return "bg-gray-100 text-gray-800";
//       case "upcoming":
//         return "bg-blue-100 text-blue-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const getVotingStatusColor = (status) => {
//     switch (status) {
//       case "ongoing":
//         return "bg-green-100 text-green-800";
//       case "finished":
//         return "bg-red-100 text-red-800";
//       case "upcoming":
//         return "bg-yellow-100 text-yellow-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const getActiveStatusColor = (active) => {
//     return active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
//   };

//   const handleCreateCompetition = async (newCompetition) => {
//     try {
//       const formData = new FormData();
//       formData.append("title", newCompetition.title);
//       formData.append("theme", newCompetition.theme || "Writing");
//       formData.append("startDateTime", newCompetition.startDateTime);
//       formData.append("endDateTime", newCompetition.endDateTime);
//       formData.append("votingStartDateTime", newCompetition.votingStartDateTime || "");
//       formData.append("votingEndDateTime", newCompetition.votingEndDateTime || "");
//       formData.append("activeStatus", newCompetition.activeStatus.toString());
//       formData.append("createdBy", newCompetition.createdBy);
//       formData.append("entryTrustScore", newCompetition.entryTrustScore || "");
//       formData.append("prizeTrustScore", newCompetition.prizetrustscore || "");
//       formData.append("maxParticipants", newCompetition.maxParticipants || "");
//       formData.append("description", newCompetition.description);
//       if (newCompetition.bannerImage) {
//         formData.append("bannerImage", newCompetition.bannerImage);
//       }
//       formData.append("rules", JSON.stringify(newCompetition.rules || []));
//       formData.append("judgingCriteria", JSON.stringify(newCompetition.judgingCriteria || []));
//       formData.append("participantEmails", JSON.stringify(newCompetition.participantEmails || []));

//       const response = await axios.post(`${baseUrl}/api/moderator/createCompetition`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       const createdCompetition = response.data;
//       const formattedCompetition = {
//         id: createdCompetition.competitionid,
//         title: createdCompetition.title || "Untitled",
//         type: createdCompetition.theme || "Writing",
//         startDate: formatDateForDisplay(createdCompetition.startdatetime),
//         endDate: formatDateForDisplay(createdCompetition.enddatetime),
//         votingEndDate: formatDateForDisplay(createdCompetition.votingenddatetime),
//         participants: createdCompetition.currentparticipants || 0,
//         submissions: 0,
//         dateStatus: createdCompetition.startdatetime && createdCompetition.enddatetime
//           ? new Date(createdCompetition.startdatetime) > new Date()
//             ? "upcoming"
//             : new Date(createdCompetition.enddatetime) < new Date()
//             ? "finished"
//             : "ongoing"
//           : "finished",
//         activeStatus: createdCompetition.activestatus || false,
//         votingStatus: createdCompetition.votingstartdatetime && createdCompetition.votingenddatetime
//           ? new Date(createdCompetition.votingstartdatetime) > new Date()
//             ? "upcoming"
//             : new Date(createdCompetition.votingenddatetime) < new Date()
//             ? "finished"
//             : "ongoing"
//           : "pending",
//         description: createdCompetition.description || "No description",
//         bannerImage: createdCompetition.bannerimage,
//         createdBy: createdCompetition.createdby,
//         entryTrustScore: createdCompetition.entrytrustscore,
//         prizeTrustScore: createdCompetition.prizetrustscore,
//         maxParticipants: createdCompetition.maxparticipants,
//         rules: createdCompetition.rules ? JSON.parse(createdCompetition.rules) : [],
//         judgingCriteria: createdCompetition.judgingcriteria ? JSON.parse(createdCompetition.judgingcriteria) : [],
//         participantEmails: createdCompetition.participantemails ? JSON.parse(createdCompetition.participantemails) : [],
//         startDateTime: createdCompetition.startdatetime || "",
//         endDateTime: createdCompetition.enddatetime || "",
//         votingStartDateTime: createdCompetition.votingstartdatetime || "",
//         votingEndDateTime: createdCompetition.votingenddatetime || "",
//       };

//       setCompetitions((prev) => [...prev, formattedCompetition]);
//       setImageStatus((prev) => ({
//         ...prev,
//         [formattedCompetition.id]: createdCompetition.bannerimage
//           ? { status: "loading", url: null, error: null }
//           : { status: "missing", url: null, error: null },
//       }));
//       setShowCreateEvent(false);
//     } catch (error) {
//       console.error("Error creating competition:", error);
//       setError("Failed to create competition: " + (error.response?.data?.message || error.message));
//     }
//   };

//   const handleEditCompetition = (updatedCompetition) => {
//     setCompetitions((prev) =>
//       prev.map((comp) =>
//         comp.id === updatedCompetition.id
//           ? {
//               ...updatedCompetition,
//               startDate: formatDateForDisplay(updatedCompetition.startDateTime),
//               endDate: formatDateForDisplay(updatedCompetition.endDateTime),
//               votingEndDate: formatDateForDisplay(updatedCompetition.votingEndDateTime),
//               type: updatedCompetition.theme || "Writing",
//               dateStatus: updatedCompetition.startDateTime && updatedCompetition.endDateTime
//                 ? new Date(updatedCompetition.startDateTime) > new Date()
//                   ? "upcoming"
//                   : new Date(updatedCompetition.endDateTime) < new Date()
//                   ? "finished"
//                   : "ongoing"
//                 : "finished",
//               activeStatus: updatedCompetition.activeStatus || false,
//               votingStatus: updatedCompetition.votingStartDateTime && updatedCompetition.votingEndDateTime
//                 ? new Date(updatedCompetition.votingStartDateTime) > new Date()
//                   ? "upcoming"
//                   : new Date(updatedCompetition.votingEndDateTime) < new Date()
//                   ? "finished"
//                   : "ongoing"
//                 : "pending",
//               participantEmails: updatedCompetition.participantEmails || [],
//               startDateTime: updatedCompetition.startDateTime || "",
//               endDateTime: updatedCompetition.endDateTime || "",
//               votingStartDateTime: updatedCompetition.votingStartDateTime || "",
//               votingEndDateTime: updatedCompetition.votingEndDateTime || "",
//             }
//           : comp
//       )
//     );
//     setShowEditEvent(false);
//     setSelectedCompetition(null);
//   };

//   const handleDeleteCompetition = async (id) => {
//     if (window.confirm("Are you sure you want to delete this competition?")) {
//       try {
//         await axios.delete(`${baseUrl}/api/moderator/deleteCompetition/${id}`);
//         setCompetitions((prev) => prev.filter((comp) => comp.id !== id));
//         setImageStatus((prev) => {
//           const newStatus = { ...prev };
//           delete newStatus[id];
//           return newStatus;
//         });
//       } catch (error) {
//         console.error("Error deleting competition:", error);
//         setError("Failed to delete competition: " + (error.response?.data?.message || error.message));
//       }
//     }
//   };

//   const handleToggleActive = (id) => {
//     setCompetitions((prev) =>
//       prev.map((comp) =>
//         comp.id === id
//           ? { ...comp, activeStatus: !comp.activeStatus }
//           : comp
//       )
//     );
//     // Later: Send update to backend
//   };

//   const handleImageClick = (src) => {
//     setEnlargedImage(src);
//   };

//   const handleCloseEnlarged = () => {
//     setEnlargedImage(null);
//   };

//   const handleViewDetails = (competition) => {
//     setSelectedCompetition(competition);
//     setShowDetailsEvent(true);
//   };

//   // Combined filtering logic
//   const filteredCompetitions = competitions.filter((comp) =>
//     showCreatedByMe
//       ? comp.createdBy === user.email && (statusFilter === "all" || comp.dateStatus === statusFilter)
//       : statusFilter === "all" || comp.dateStatus === statusFilter
//   );

//   // Dummy data for leaderboards and submissions
//   const leaderboards = [
//     {
//       competitionId: "1",
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
//       competitionId: "1",
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
//       competitionId: "1",
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
//       competitionId: "2",
//       title: "The Last Library",
//       author: "story_teller",
//       submissionDate: "2024-01-18",
//       status: "approved",
//       votes: 45,
//       averageRating: 4.2,
//       flagged: false,
//     },
//   ];

//   return (
//     <div className="space-y-6 p-4 bg-gray-50 min-h-screen">
//       {/* Error Message */}
//       {error && (
//         <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
//           {error}
//         </div>
//       )}

//       {/* Loading State */}
//       {isLoading && (
//         <div className="flex items-center justify-center">
//           <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//           <span className="ml-2 text-gray-600">Loading competitions...</span>
//         </div>
//       )}

//       {/* No Competitions Message */}
//       {!isLoading && competitions.length === 0 && (
//         <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
//           <p className="text-gray-600 text-lg">No competitions found. Create a new one to get started!</p>
//           <button
//             onClick={() => setShowCreateEvent(true)}
//             className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 mx-auto"
//           >
//             <Plus className="w-4 h-4" />
//             <span>Create Event</span>
//           </button>
//         </div>
//       )}

//       {/* Stats Cards */}
//       {!isLoading && competitions.length > 0 && (
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//           <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-600 text-sm font-medium">Ongoing Competitions</p>
//                 <p className="text-2xl font-bold text-gray-900 mt-1">
//                   {competitions.filter((c) => c.dateStatus === "ongoing").length}
//                 </p>
//               </div>
//               <Trophy className="w-8 h-8 text-yellow-500" />
//             </div>
//           </div>
//           <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-600 text-sm font-medium">Total Participants</p>
//                 <p className="text-2xl font-bold text-gray-900 mt-1">
//                   {competitions.reduce((sum, c) => sum + c.participants, 0)}
//                 </p>
//               </div>
//               <Users className="w-8 h-8 text-blue-500" />
//             </div>
//           </div>
//           <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-600 text-sm font-medium">Submissions</p>
//                 <p className="text-2xl font-bold text-gray-900 mt-1">
//                   {competitions.reduce((sum, c) => sum + c.submissions, 0)}
//                 </p>
//               </div>
//               <Star className="w-8 h-8 text-purple-500" />
//             </div>
//           </div>
//           <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-600 text-sm font-medium">Pending Reviews</p>
//                 <p className="text-2xl font-bold text-gray-900 mt-1">23</p>
//               </div>
//               <Eye className="w-8 h-8 text-green-500" />
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Tabs */}
//       {!isLoading && competitions.length > 0 && (
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200">
//           <div className="border-b border-gray-200">
//             <nav className="flex items-center justify-between px-6">
//               <div className="-mb-px flex space-x-8">
//                 <button
//                   onClick={() => setActiveTab("active")}
//                   className={`py-4 px-1 border-b-2 font-medium text-sm ${
//                     activeTab === "active"
//                       ? "border-blue-600 text-blue-600"
//                       : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                   }`}
//                 >
//                   Active Competitions
//                 </button>
//                 <button
//                   onClick={() => setActiveTab("leaderboards")}
//                   className={`py-4 px-1 border-b-2 font-medium text-sm ${
//                     activeTab === "leaderboards"
//                       ? "border-blue-600 text-blue-600"
//                       : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                   }`}
//                 >
//                   Leaderboards
//                 </button>
//                 <button
//                   onClick={() => setActiveTab("submissions")}
//                   className={`py-4 px-1 border-b-2 font-medium text-sm ${
//                     activeTab === "submissions"
//                       ? "border-blue-600 text-blue-600"
//                       : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                   }`}
//                 >
//                   Submissions
//                 </button>
//               </div>
//               <div className="py-4">
//                 <button
//                   onClick={() => setShowCreateEvent(true)}
//                   className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
//                 >
//                   <Plus className="w-4 h-4" />
//                   <span>Create Event</span>
//                 </button>
//               </div>
//             </nav>
//           </div>

//           {/* Create Modal */}
//           {showCreateEvent && (
//             <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
//               <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-lg relative p-6">
//                 <button
//                   onClick={() => setShowCreateEvent(false)}
//                   className="absolute top-4 right-4 text-gray-600 hover:text-red-600 text-xl font-bold"
//                   aria-label="Close"
//                 >
//                   &times;
//                 </button>
//                 <CompetitionCreate
//                   setShowCreateEvent={setShowCreateEvent}
//                   onCreate={handleCreateCompetition}
//                 />
//               </div>
//             </div>
//           )}

//           {/* Edit Modal */}
//           {showEditEvent && selectedCompetition && (
//             <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
//               <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-lg p-6">
//                 <button
//                   onClick={() => setShowEditEvent(false)}
//                   className="absolute top-4 right-4 text-gray-600 hover:text-red-600 text-xl font-bold"
//                   aria-label="Close"
//                 >
//                   &times;
//                 </button>
//                 <CompetitionEdit
//                   competition={selectedCompetition}
//                   onUpdate={handleEditCompetition}
//                   onCancel={() => setShowEditEvent(false)}
//                 />
//               </div>
//             </div>
//           )}

//           {/* Details Modal */}
//           {showDetailsEvent && selectedCompetition && (
//             <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
//               <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-lg p-6">
//                 <CompetitionDetails
//                   competition={selectedCompetition}
//                   currentUserEmail={user.email}
//                   closeModal={() => setShowDetailsEvent(false)}
//                 />
//               </div>
//             </div>
//           )}

//           <div className="p-6">
//             {activeTab === "active" && (
//               <div>
//                 {/* Filter */}
//                 <div className="flex items-center space-x-4 mb-6">
//                   <Filter className="w-5 h-5 text-gray-500" />
//                   <select
//                     value={statusFilter}
//                     onChange={(e) => setStatusFilter(e.target.value)}
//                     className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   >
//                     <option value="all">All Competitions</option>
//                     <option value="upcoming">Upcoming</option>
//                     <option value="ongoing">Ongoing</option>
//                     <option value="finished">Finished</option>
//                   </select>
//                   <button
//                     onClick={() => setShowCreatedByMe(!showCreatedByMe)}
//                     className={`px-3 py-2 rounded-lg text-sm font-medium ${
//                       showCreatedByMe ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
//                     } hover:opacity-90 transition-opacity`}
//                   >
//                     Created By Me
//                   </button>
//                 </div>

//                 {filteredCompetitions.length === 0 && (
//                   <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
//                     <p className="text-gray-600 text-lg">
//                       No {statusFilter === "all" ? "" : statusFilter} competitions found.
//                     </p>
//                   </div>
//                 )}

//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                   {filteredCompetitions.map((competition) => (
//                     <div
//                       key={competition.id}
//                       className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
//                     >
//                       <div className="flex items-center justify-between mb-4">
//                         <h3 className="text-lg font-semibold text-gray-900">
//                           {competition.title}
//                         </h3>
//                         <div className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
//                           Created by: {competition.createdBy === user.email ? "You" : competition.createdBy}
//                         </div>
//                       </div>

//                       <div className="flex items-start justify-between mb-4">
//                         <p className="text-gray-600 text-sm">
//                           {competition.type}
//                         </p>
//                         <div className="flex flex-col space-y-1">
//                           <span
//                             className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
//                               competition.dateStatus
//                             )}`}
//                           >
//                             {competition.dateStatus}
//                           </span>
//                           <span
//                             className={`px-2 py-1 rounded-full text-xs font-medium ${getVotingStatusColor(
//                               competition.votingStatus
//                             )}`}
//                           >
//                             Voting {competition.votingStatus}
//                           </span>
//                           <span
//                             className={`px-2 py-1 rounded-full text-xs font-medium ${getActiveStatusColor(
//                               competition.activeStatus
//                             )}`}
//                           >
//                             {competition.activeStatus ? "Active" : "Paused"}
//                           </span>
//                         </div>
//                       </div>

//                       {/* Banner Image */}
//                       <div className="mb-4">
//                         {imageStatus[competition.id]?.status === "missing" ? (
//                           <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-lg border border-gray-200 text-gray-500">
//                             No Image Uploaded
//                           </div>
//                         ) : imageStatus[competition.id]?.status === "loading" ? (
//                           <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-lg border border-gray-200 text-gray-500">
//                             <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//                             <span className="ml-2">Loading...</span>
//                           </div>
//                         ) : imageStatus[competition.id]?.status === "not_found" ? (
//                           <div className="w-full h-48 flex flex-col items-center justify-center bg-gray-100 rounded-lg border border-gray-200 text-red-600">
//                             <AlertCircle className="w-6 h-6 mb-2" />
//                             <p>Image not found: {imageStatus[competition.id]?.error}</p>
//                           </div>
//                         ) : (
//                           <img
//                             src={imageStatus[competition.id]?.url}
//                             alt={competition.title}
//                             className="w-full h-48 object-cover rounded-lg border border-gray-200 cursor-pointer"
//                             onClick={() => handleImageClick(imageStatus[competition.id]?.url)}
//                             onError={() =>
//                               setImageStatus((prev) => ({
//                                 ...prev,
//                                 [competition.id]: {
//                                   status: "not_found",
//                                   url: null,
//                                   error: "Image failed to load",
//                                 },
//                               }))
//                             }
//                             onLoad={() =>
//                               setImageStatus((prev) => ({
//                                 ...prev,
//                                 [competition.id]: {
//                                   ...prev[competition.id],
//                                   status: "loaded",
//                                   error: null,
//                                 },
//                               }))
//                             }
//                           />
//                         )}
//                       </div>

//                       <div className="space-y-3 mb-4">
//                         <div className="flex items-center justify-between text-sm">
//                           <span className="text-gray-600">Duration:</span>
//                           <span className="font-medium">
//                             {competition.startDate || "Not set"} - {competition.votingEndDate || "Not set"}
//                           </span>
//                         </div>
//                         <div className="grid grid-cols-2 gap-4">
//                           <div className="text-center">
//                             <p className="text-xl font-bold text-gray-900">
//                               {competition.participants}
//                             </p>
//                             <p className="text-gray-600 text-sm">Participants</p>
//                           </div>
//                           <div className="text-center">
//                             <p className="text-xl font-bold text-blue-600">
//                               {competition.submissions}
//                             </p>
//                             <p className="text-gray-600 text-sm">Submissions</p>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="mb-4">
//                         <p className="text-sm font-medium text-gray-700 mb-2">
//                           Description:
//                         </p>
//                         <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
//                           {competition.description}
//                         </p>
//                       </div>

//                       <div className="flex justify-between items-center">
//                         <button
//                           onClick={() => handleViewDetails(competition)}
//                           className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
//                         >
//                           <Eye className="w-4 h-4 mr-1" />
//                           View Details
//                         </button>
//                         <div className="flex space-x-2">
//                           {competition.createdBy === user.email && (
//                             <>
//                               <button
//                                 onClick={() => handleToggleActive(competition.id)}
//                                 disabled={competition.activeStatus}
//                                 className={`text-sm font-medium px-2 py-1 rounded ${
//                                   competition.activeStatus
//                                     ? "bg-green-100 text-green-800 cursor-not-allowed"
//                                     : "bg-green-600 text-white hover:bg-green-700"
//                                 }`}
//                               >
//                                 Active
//                               </button>
//                               <button
//                                 onClick={() => handleToggleActive(competition.id)}
//                                 disabled={!competition.activeStatus}
//                                 className={`text-sm font-medium px-2 py-1 rounded ${
//                                   !competition.activeStatus
//                                     ? "bg-red-100 text-red-800 cursor-not-allowed"
//                                     : "bg-red-600 text-white hover:bg-red-700"
//                                 }`}
//                               >
//                                 Pause
//                               </button>
//                               <button
//                                 onClick={() => {
//                                   setSelectedCompetition(competition);
//                                   setShowEditEvent(true);
//                                 }}
//                                 className="text-gray-600 hover:text-gray-900 text-sm font-medium"
//                               >
//                                 Edit
//                               </button>
//                               <button
//                                 onClick={() => handleDeleteCompetition(competition.id)}
//                                 className="text-red-600 hover:text-red-800 text-sm font-medium"
//                               >
//                                 Delete
//                               </button>
//                               <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
//                                 Manage
//                               </button>
//                             </>
//                           )}
//                           {competition.createdBy !== user.email && (
//                             <>
//                               <button
//                                 onClick={() => {
//                                   setSelectedCompetition(competition);
//                                   setShowEditEvent(true);
//                                 }}
//                                 className="text-gray-600 hover:text-gray-900 text-sm font-medium"
//                               >
//                                 Edit
//                               </button>
//                               <button
//                                 onClick={() => handleDeleteCompetition(competition.id)}
//                                 className="text-red-600 hover:text-red-800 text-sm font-medium"
//                               >
//                                 Delete
//                               </button>
//                             </>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {activeTab === "leaderboards" && (
//               <div className="space-y-6">
//                 {leaderboards.map((leaderboard) => (
//                   <div
//                     key={leaderboard.competitionId}
//                     className="bg-white rounded-lg border border-gray-200 overflow-hidden"
//                   >
//                     <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
//                       <h3 className="text-lg font-semibold text-gray-900">
//                         {leaderboard.title}
//                       </h3>
//                       <p className="text-gray-600 text-sm">
//                         Current standings based on community votes
//                       </p>
//                     </div>
//                     <div className="overflow-x-auto">
//                       <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-gray-50">
//                           <tr>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                               Rank
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                               Entry
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                               Author
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                               Votes
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                               Score
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                               Actions
//                             </th>
//                           </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                           {leaderboard.entries.map((entry) => (
//                             <tr key={entry.rank} className="hover:bg-gray-50">
//                               <td className="px-6 py-4 whitespace-nowrap">
//                                 <div className="flex items-center">
//                                   <span
//                                     className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
//                                       entry.rank === 1
//                                         ? "bg-yellow-100 text-yellow-800"
//                                         : entry.rank === 2
//                                         ? "bg-gray-100 text-gray-800"
//                                         : entry.rank === 3
//                                         ? "bg-orange-100 text-orange-800"
//                                         : "bg-blue-100 text-blue-800"
//                                     }`}
//                                   >
//                                     {entry.rank}
//                                   </span>
//                                 </div>
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap">
//                                 <div className="text-sm font-medium text-gray-900">
//                                   {entry.title}
//                                 </div>
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap">
//                                 <div className="text-sm text-gray-600">
//                                   {entry.author}
//                                 </div>
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap">
//                                 <div className="text-sm text-gray-900">
//                                   {entry.votes}
//                                 </div>
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap">
//                                 <div className="flex items-center">
//                                   <Star className="w-4 h-4 text-yellow-400 mr-1" />
//                                   <span className="text-sm text-gray-900">
//                                     {entry.score}
//                                   </span>
//                                 </div>
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                                 <button className="text-blue-600 hover:text-blue-800 mr-3">
//                                   View
//                                 </button>
//                                 <button className="text-gray-600 hover:text-gray-900">
//                                   Moderate
//                                 </button>
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {activeTab === "submissions" && (
//               <div className="space-y-4">
//                 {submissions.map((submission) => (
//                   <div
//                     key={submission.id}
//                     className={`p-6 rounded-lg ${
//                       submission.flagged
//                         ? "bg-red-50 border border-red-200"
//                         : "bg-gray-50 border border-gray-200"
//                     } hover:bg-gray-100 transition-colors`}
//                   >
//                     <div className="flex items-start justify-between">
//                       <div className="flex-1">
//                         <div className="flex items-center space-x-3 mb-2">
//                           <h3 className="text-lg font-semibold text-gray-900">
//                             {submission.title}
//                           </h3>
//                           <span className="text-gray-600 text-sm">
//                             by {submission.author}
//                           </span>
//                           {submission.flagged && (
//                             <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
//                               Flagged
//                             </span>
//                           )}
//                         </div>
//                         <p className="text-sm text-gray-600 mb-3">
//                           Submitted: {submission.submissionDate} • Status: {submission.status} •
//                           Votes: {submission.votes} • Rating: {submission.averageRating}
//                         </p>
//                       </div>
//                       <div className="flex space-x-2 ml-4">
//                         <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
//                           Review
//                         </button>
//                         {submission.status === "pending" && (
//                           <>
//                             <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors">
//                               Approve
//                             </button>
//                             <button className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
//                               Reject
//                             </button>
//                           </>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Enlarged Image Modal */}
//       {enlargedImage && (
//         <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-60">
//           <div className="relative max-w-4xl w-full m-4">
//             <button
//               onClick={handleCloseEnlarged}
//               className="absolute top-2 right-2 p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors"
//             >
//               <X className="w-6 h-6" />
//             </button>
//             <img
//               src={enlargedImage}
//               alt="Enlarged Image"
//               className="w-full h-auto max-h-[80vh] object-contain rounded-md"
//             />
//           </div>
//         </div>
//       )}

//       <style jsx>{`
//         .animate-spin {
//           animation: spin 1s linear infinite;
//         }
//         @keyframes spin {
//           0% {
//             transform: rotate(0deg);
//           }
//           100% {
//             transform: rotate(360deg);
//           }
//         }
//         .line-clamp-3 {
//           display: -webkit-box;
//           -webkit-line-clamp: 3;
//           -webkit-box-orient: vertical;
//           overflow: hidden;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Competitions;
