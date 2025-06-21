import React, { useState } from 'react';
import { Trophy, Calendar, Users, Star, Plus, Eye } from 'lucide-react';

const Competitions = () => {
  const [activeTab, setActiveTab] = useState('active');

  const competitions = [
    {
      id: 1,
      title: 'Winter Poetry Challenge',
      type: 'Poetry',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      participants: 87,
      submissions: 156,
      status: 'active',
      votingStatus: 'open',
      prizes: ['$500 First Prize', '$300 Second Prize', '$200 Third Prize']
    },
    {
      id: 2,
      title: 'Short Story Contest',
      type: 'Short Story',
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      participants: 45,
      submissions: 67,
      status: 'active',
      votingStatus: 'pending',
      prizes: ['$1000 Grand Prize', '$500 Runner-up']
    },
    {
      id: 3,
      title: 'Book Review Excellence',
      type: 'Book Review',
      startDate: '2023-12-01',
      endDate: '2023-12-31',
      participants: 123,
      submissions: 245,
      status: 'completed',
      votingStatus: 'closed',
      prizes: ['Featured Review', '$200 Cash Prize']
    }
  ];

  const leaderboards = [
    {
      competitionId: 1,
      title: 'Winter Poetry Challenge',
      entries: [
        { rank: 1, author: 'poet_sarah', title: 'Frozen Dreams', votes: 234, score: 4.8 },
        { rank: 2, author: 'verse_master', title: 'Winter\'s Embrace', votes: 198, score: 4.6 },
        { rank: 3, author: 'rhyme_time', title: 'Snow Whispers', votes: 176, score: 4.5 },
        { rank: 4, author: 'word_weaver', title: 'Icy Reflections', votes: 145, score: 4.3 },
        { rank: 5, author: 'poem_pilot', title: 'Arctic Thoughts', votes: 132, score: 4.2 }
      ]
    }
  ];

  const submissions = [
    {
      id: 1,
      competitionId: 1,
      title: 'Frozen Dreams',
      author: 'poet_sarah',
      submissionDate: '2024-01-10',
      status: 'approved',
      votes: 234,
      averageRating: 4.8,
      flagged: false
    },
    {
      id: 2,
      competitionId: 1,
      title: 'Winter Storm',
      author: 'new_writer_123',
      submissionDate: '2024-01-12',
      status: 'pending',
      votes: 0,
      averageRating: 0,
      flagged: true
    },
    {
      id: 3,
      competitionId: 2,
      title: 'The Last Library',
      author: 'story_teller',
      submissionDate: '2024-01-18',
      status: 'approved',
      votes: 45,
      averageRating: 4.2,
      flagged: false
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVotingStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary">Competition Management</h1>
          <p className="text-gray-600 mt-1">Organize creative writing competitions and manage submissions</p>
        </div>
        <button className="bg-secondary hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Create Competition</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-cardBg rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Active Competitions</p>
              <p className="text-2xl font-bold text-textPrimary mt-1">6</p>
            </div>
            <Trophy className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-cardBg rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Participants</p>
              <p className="text-2xl font-bold text-textPrimary mt-1">342</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-cardBg rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Submissions</p>
              <p className="text-2xl font-bold text-textPrimary mt-1">567</p>
            </div>
            <Star className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-cardBg rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Pending Reviews</p>
              <p className="text-2xl font-bold text-textPrimary mt-1">23</p>
            </div>
            <Eye className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-cardBg rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('active')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'active'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Active Competitions
            </button>
            <button
              onClick={() => setActiveTab('leaderboards')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'leaderboards'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Leaderboards
            </button>
            <button
              onClick={() => setActiveTab('submissions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'submissions'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Submissions
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'active' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {competitions.map((competition) => (
                <div key={competition.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-textPrimary">{competition.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{competition.type}</p>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(competition.status)}`}>
                        {competition.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getVotingStatusColor(competition.votingStatus)}`}>
                        voting {competition.votingStatus}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{competition.startDate} - {competition.endDate}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-xl font-bold text-textPrimary">{competition.participants}</p>
                        <p className="text-gray-600 text-sm">Participants</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-bold text-textPrimary">{competition.submissions}</p>
                        <p className="text-gray-600 text-sm">Submissions</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Prizes:</p>
                    <div className="space-y-1">
                      {competition.prizes.map((prize, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Trophy className="w-3 h-3 text-yellow-500" />
                          <span className="text-sm text-gray-600">{prize}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <button className="text-accent hover:text-primary text-sm font-medium flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </button>
                    <div className="flex space-x-2">
                      <button className="text-gray-600 hover:text-textPrimary text-sm font-medium">Edit</button>
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Manage</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'leaderboards' && (
            <div className="space-y-6">
              {leaderboards.map((leaderboard) => (
                <div key={leaderboard.competitionId} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-textPrimary">{leaderboard.title}</h3>
                    <p className="text-gray-600 text-sm">Current standings based on community votes</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entry</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Votes</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {leaderboard.entries.map((entry) => (
                          <tr key={entry.rank} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                                  entry.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                                  entry.rank === 2 ? 'bg-gray-100 text-gray-800' :
                                  entry.rank === 3 ? 'bg-orange-100 text-orange-800' :
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                  {entry.rank}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-textPrimary">{entry.title}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-600">{entry.author}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-textPrimary">{entry.votes}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                                <span className="text-sm text-textPrimary">{entry.score}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button className="text-accent hover:text-primary mr-3">View</button>
                              <button className="text-gray-600 hover:text-textPrimary">Moderate</button>
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

          {activeTab === 'submissions' && (
            <div className="space-y-4">
              {submissions.map((submission) => (
                <div key={submission.id} className={`p-6 rounded-lg ${submission.flagged ? 'bg-red-50 border border-red-200' : 'bg-gray-50'} hover:bg-gray-100 transition-colors`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-textPrimary">{submission.title}</h3>
                        <span className="text-gray-600 text-sm">by {submission.author}</span>
                        {submission.flagged && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                            Flagged
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-gray-500">Submitted:</span>
                          <p className="font-medium">{submission.submissionDate}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Status:</span>
                          <p className={`font-medium ${submission.status === 'approved' ? 'text-success' : 'text-yellow-600'}`}>
                            {submission.status}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Votes:</span>
                          <p className="font-medium">{submission.votes}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Rating:</span>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 mr-1" />
                            <span className="font-medium">{submission.averageRating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button className="px-3 py-1 bg-accent text-white rounded text-sm hover:bg-blue-700 transition-colors">
                        Review
                      </button>
                      {submission.status === 'pending' && (
                        <>
                          <button className="px-3 py-1 bg-success text-white rounded text-sm hover:bg-green-700 transition-colors">
                            Approve
                          </button>
                          <button className="px-3 py-1 bg-error text-white rounded text-sm hover:bg-red-700 transition-colors">
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
    </div>
  );
};

export default Competitions;