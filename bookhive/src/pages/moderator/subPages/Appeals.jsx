import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Appeals = ({ statusFilter }) => {
  const [appeals, setAppeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppeals = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:9090/api/moderator/getAppeals', {
          headers: { 'Content-Type': 'application/json' },
        });
        setAppeals(
          response.data
            .filter(appeal => statusFilter.includes(appeal.status))
            .map((appeal, index) => ({
              id: `APP-${1001 + index}`,
              username: appeal.email ? appeal.email.split('@')[0] : `user${index}`,
              appealDate: appeal.createdAt
                ? new Date(appeal.createdAt).toLocaleDateString()
                : new Date().toLocaleDateString(),
              originalPenalty: appeal.penalty || 'Unknown',
              reason: appeal.reason || 'No reason provided',
              appealReason: appeal.appealReason || 'No appeal reason provided',
              evidence: appeal.evidence || 'No evidence provided',
              status: appeal.status || 'unknown',
              priority: appeal.priority || 'low'
            }))
        );
      } catch (err) {
        setError(err.message);
        toast.error(`Failed to fetch appeals: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchAppeals();
  }, [statusFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-300';
    }
  };

  return (
    <div className="space-y-4">
      {loading && <p className="text-gray-600">Loading...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}
      {!loading && !error && appeals.length === 0 && (
        <p className="text-gray-600">No appeals found.</p>
      )}
      {!loading &&
        appeals.map((appeal) => (
          <div 
            key={appeal.id}
            className={`p-6 rounded-lg border-l-4 ${getPriorityColor(appeal.priority)} bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">Appeal from @{appeal.username}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appeal.status)}`}>
                    {appeal.status.replace('_', ' ')}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    appeal.priority === 'high' ? 'bg-red-100 text-red-700' :
                    appeal.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-600'
                  }`}>
                    {appeal.priority} priority
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Original Penalty: {appeal.originalPenalty} - {appeal.reason} • 
                  Appeal Reason: {appeal.appealReason} • 
                  Evidence: {appeal.evidence}
                </p>
                <p className="text-sm text-gray-500">
                  Appeal Date: {appeal.appealDate}
                </p>
              </div>
              <div className="flex space-x-2 ml-4">
                <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                  Review Evidence
                </button>
                {statusFilter.includes('pending') && (
                  <>
                    <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors">
                      Accept Appeal
                    </button>
                    <button className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors">
                      Reject Appeal
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Appeals;