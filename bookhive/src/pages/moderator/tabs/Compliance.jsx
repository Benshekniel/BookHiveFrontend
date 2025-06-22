import React, { useState } from 'react';
import { Shield, AlertTriangle, FileText, Eye, Clock, CheckCircle } from 'lucide-react';

const Compliance = () => {
  const [activeTab, setActiveTab] = useState('reports');

  const recoveryReports = [
    {
      id: 'BR-1001',
      reportedBook: 'To Kill a Mockingbird',
      isbn: '978-0-06-112008-4',
      reportedBy: 'user_jane_doe',
      reportDate: '2024-01-15',
      reason: 'Book not returned after 2 weeks',
      currentHolder: 'missing_user_123',
      status: 'investigating',
      priority: 'high',
      trustScoreImpact: -15
    },
    {
      id: 'BR-1002',
      reportedBook: '1984',
      isbn: '978-0-452-28423-4',
      reportedBy: 'concerned_reader',
      reportDate: '2024-01-14',
      reason: 'Book damaged during exchange',
      currentHolder: 'careless_reader',
      status: 'resolved',
      priority: 'medium',
      trustScoreImpact: -10
    },
    {
      id: 'BR-1003',
      reportedBook: 'The Great Gatsby',
      isbn: '978-0-7432-7356-5',
      reportedBy: 'bookworm_alice',
      reportDate: '2024-01-13',
      reason: 'Unauthorized sale of borrowed book',
      currentHolder: 'book_seller_99',
      status: 'under_review',
      priority: 'high',
      trustScoreImpact: -25
    }
  ];

  const policyViolations = [
    {
      id: 'PV-1001',
      user: 'repeat_offender',
      violationType: 'Multiple Late Returns',
      description: 'User has returned 5 books late in the past month',
      date: '2024-01-15',
      actionTaken: 'Account Suspended',
      severity: 'high'
    },
    {
      id: 'PV-1002',
      user: 'fake_reviewer',
      violationType: 'Fake Reviews',
      description: 'Creating multiple fake positive reviews for own books',
      date: '2024-01-14',
      actionTaken: 'Reviews Removed',
      severity: 'medium'
    },
    {
      id: 'PV-1003',
      user: 'spammer_account',
      violationType: 'Spam Activity',
      description: 'Posting promotional content in book circles',
      date: '2024-01-13',
      actionTaken: 'Warning Issued',
      severity: 'low'
    }
  ];

  const suspiciousActivity = [
    {
      id: 'SA-1001',
      user: 'new_account_suspicious',
      activity: 'Rapid book requests',
      description: 'Requested 15 books within 2 hours of account creation',
      timestamp: '2024-01-15 16:30',
      riskLevel: 'high',
      autoFlag: true
    },
    {
      id: 'SA-1002',
      user: 'pattern_user',
      activity: 'Unusual exchange pattern',
      description: 'Only exchanges with accounts created within same week',
      timestamp: '2024-01-15 14:20',
      riskLevel: 'medium',
      autoFlag: true
    },
    {
      id: 'SA-1003',
      user: 'location_jumper',
      activity: 'Inconsistent location',
      description: 'Location changes significantly between exchanges',
      timestamp: '2024-01-15 12:15',
      riskLevel: 'low',
      autoFlag: false
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'investigating': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      case 'escalated': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-error';
      case 'medium': return 'border-l-secondary';
      case 'low': return 'border-l-success';
      default: return 'border-l-gray-300';
    }
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'border-l-error';
      case 'medium': return 'border-l-secondary';
      case 'low': return 'border-l-success';
      default: return 'border-l-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary">Compliance Monitoring</h1>
          <p className="text-gray-600 mt-1">Monitor policy violations and ensure platform integrity</p>
        </div>
        <div className="flex space-x-2">
          <button className="bg-accent hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <FileText className="w-4 h-4" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-cardBg rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Active Reports</p>
              <p className="text-2xl font-bold text-textPrimary mt-1">15</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-cardBg rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Policy Violations</p>
              <p className="text-2xl font-bold text-textPrimary mt-1">8</p>
            </div>
            <Shield className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="bg-cardBg rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Suspicious Activity</p>
              <p className="text-2xl font-bold text-textPrimary mt-1">12</p>
            </div>
            <Eye className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-cardBg rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Resolved Today</p>
              <p className="text-2xl font-bold text-textPrimary mt-1">6</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-cardBg rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reports'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Recovery Reports
            </button>
            <button
              onClick={() => setActiveTab('violations')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'violations'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Policy Violations
            </button>
            <button
              onClick={() => setActiveTab('suspicious')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'suspicious'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Suspicious Activity
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'reports' && (
            <div className="space-y-4">
              {recoveryReports.map((report) => (
                <div 
                  key={report.id}
                  className={`p-6 rounded-lg border-l-4 ${getPriorityColor(report.priority)} bg-gray-50 hover:bg-gray-100 transition-colors`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-textPrimary">{report.reportedBook}</h3>
                        <span className="text-gray-600 text-sm">#{report.id}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          report.priority === 'high' ? 'bg-red-100 text-red-700' :
                          report.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {report.priority}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{report.reason}</p>
                      
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-gray-500">ISBN:</span>
                          <p className="font-medium">{report.isbn}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Current Holder:</span>
                          <p className="font-medium">{report.currentHolder}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Reported By:</span>
                          <p className="font-medium">{report.reportedBy}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">TrustScore Impact:</span>
                          <p className="font-medium text-error">{report.trustScoreImpact}</p>
                        </div>
                      </div>

                      <div className="text-sm text-gray-500">
                        Report Date: {report.reportDate}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <button className="px-3 py-1 bg-accent text-white rounded text-sm hover:bg-blue-700 transition-colors">
                        Investigate
                      </button>
                      {report.status === 'investigating' && (
                        <button className="px-3 py-1 bg-success text-white rounded text-sm hover:bg-green-700 transition-colors">
                          Resolve
                        </button>
                      )}
                      <button className="px-3 py-1 bg-error text-white rounded text-sm hover:bg-red-700 transition-colors">
                        Escalate
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'violations' && (
            <div className="space-y-4">
              {policyViolations.map((violation) => (
                <div 
                  key={violation.id}
                  className={`p-6 rounded-lg border-l-4 ${getSeverityColor(violation.severity)} bg-gray-50 hover:bg-gray-100 transition-colors`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-textPrimary">{violation.violationType}</h3>
                        <span className="text-gray-600 text-sm">by {violation.user}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          violation.severity === 'high' ? 'bg-red-100 text-red-700' :
                          violation.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {violation.severity}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{violation.description}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                        <span>Date: {violation.date}</span>
                        <span>•</span>
                        <span>Action Taken: {violation.actionTaken}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <button className="px-3 py-1 bg-accent text-white rounded text-sm hover:bg-blue-700 transition-colors">
                        View Details
                      </button>
                      <button className="px-3 py-1 bg-secondary text-white rounded text-sm hover:bg-yellow-600 transition-colors">
                        Add Penalty
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'suspicious' && (
            <div className="space-y-4">
              {suspiciousActivity.map((activity) => (
                <div key={activity.id} className="p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-textPrimary">{activity.activity}</h3>
                        <span className="text-gray-600 text-sm">by {activity.user}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(activity.riskLevel)}`}>
                          {activity.riskLevel} risk
                        </span>
                        {activity.autoFlag && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                            Auto-flagged
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-3">{activity.description}</p>
                      
                      <div className="text-sm text-gray-500">
                        Detected: {activity.timestamp}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <button className="px-3 py-1 bg-accent text-white rounded text-sm hover:bg-blue-700 transition-colors">
                        Investigate
                      </button>
                      <button className="px-3 py-1 bg-success text-white rounded text-sm hover:bg-green-700 transition-colors">
                        Clear
                      </button>
                      <button className="px-3 py-1 bg-error text-white rounded text-sm hover:bg-red-700 transition-colors">
                        Flag User
                      </button>
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

export default Compliance;