import React, { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle, Eye, Download, RefreshCw, Lock, Users, Globe } from 'lucide-react';

const SecurityCompliance = () => {
  const [selectedTab, setSelectedTab] = useState('audit');

  const securityLogs = [
    {
      id: 1,
      type: 'failed_login',
      severity: 'high',
      message: 'Multiple failed login attempts from IP 192.168.1.100',
      timestamp: '2024-01-15 14:30:22',
      ip: '192.168.1.100',
      user: 'john.doe@email.com',
      status: 'blocked'
    },
    {
      id: 2,
      type: 'suspicious_activity',
      severity: 'medium',
      message: 'Unusual API access pattern detected',
      timestamp: '2024-01-15 13:45:18',
      ip: '203.94.15.22',
      user: 'api_user_001',
      status: 'monitoring'
    },
    {
      id: 3,
      type: 'token_expired',
      severity: 'low',
      message: 'JWT token expired for user session',
      timestamp: '2024-01-15 12:15:09',
      ip: '10.0.0.45',
      user: 'alice.smith@email.com',
      status: 'resolved'
    }
  ];

  const disputes = [
    {
      id: 1,
      type: 'book_not_returned',
      status: 'active',
      reporter: 'Sarah Johnson',
      reportee: 'Mike Wilson',
      bookTitle: 'The Great Gatsby',
      description: 'Book not returned after 2 weeks past due date',
      createdAt: '2024-01-10',
      priority: 'high'
    },
    {
      id: 2,
      type: 'payment_dispute',
      status: 'pending',
      reporter: 'David Chen',
      reportee: 'Emma Davis',
      bookTitle: 'To Kill a Mockingbird',
      description: 'Payment made but book not delivered',
      createdAt: '2024-01-12',
      priority: 'medium'
    },
    {
      id: 3,
      type: 'condition_mismatch',
      status: 'resolved',
      reporter: 'Lisa Brown',
      reportee: 'Tom Anderson',
      bookTitle: '1984',
      description: 'Book condition significantly worse than described',
      createdAt: '2024-01-08',
      priority: 'low'
    }
  ];

  const complianceChecks = [
    {
      category: 'Data Protection',
      checks: [
        { name: 'Personal Data Encryption', status: 'passed', description: 'All personal data encrypted at rest' },
        { name: 'GDPR Compliance', status: 'passed', description: 'User consent mechanisms in place' },
        { name: 'Data Retention Policy', status: 'warning', description: 'Review retention periods' },
        { name: 'Right to Deletion', status: 'passed', description: 'User data deletion process active' }
      ]
    },
    {
      category: 'Security',
      checks: [
        { name: 'SSL/TLS Certificate', status: 'passed', description: 'Valid certificate installed' },
        { name: 'API Rate Limiting', status: 'passed', description: 'Rate limits configured' },
        { name: 'Password Policy', status: 'passed', description: 'Strong password requirements enforced' },
        { name: 'Two-Factor Authentication', status: 'failed', description: '2FA not implemented' }
      ]
    },
    {
      category: 'Legal',
      checks: [
        { name: 'Terms of Service', status: 'passed', description: 'Current terms accepted by users' },
        { name: 'Privacy Policy', status: 'passed', description: 'Updated privacy policy in effect' },
        { name: 'Sri Lankan ICT Act Compliance', status: 'passed', description: 'Compliant with local regulations' },
        { name: 'Age Verification', status: 'warning', description: 'Enhanced verification needed' }
      ]
    }
  ];

  const getSeverityColor = (severity) => {
    const colors = {
      high: 'bg-red-500 text-white',
      medium: 'bg-yellow-400 text-white',
      low: 'bg-green-500 text-white'
    };
    return colors[severity] || colors.low;
  };

  const getStatusColor = (status) => {
    const colors = {
      passed: 'bg-green-500 text-white',
      warning: 'bg-yellow-400 text-white',
      failed: 'bg-red-500 text-white',
      blocked: 'bg-red-500 text-white',
      monitoring: 'bg-yellow-400 text-white',
      resolved: 'bg-green-500 text-white',
      active: 'bg-blue-500 text-white',
      pending: 'bg-yellow-400 text-white'
    };
    return colors[status] || colors.pending;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      default:
        return <Shield className="h-4 w-4 text-blue-500" />;
    }
  };

  const tabs = [
    { id: 'audit', name: 'Security Audit', icon: Shield },
    { id: 'disputes', name: 'Dispute Resolution', icon: Users },
    { id: 'compliance', name: 'Compliance Status', icon: CheckCircle }
  ];

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Security & Compliance</h1>
        <p className="mt-2 text-sm text-slate-600">
          Monitor platform security, manage disputes, and ensure regulatory compliance.
        </p>
      </div>

      {/* Security Overview Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow-lg rounded-lg border border-slate-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Shield className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-500 truncate">Security Score</dt>
                  <dd className="text-2xl font-bold text-slate-900">85/100</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow-lg rounded-lg border border-slate-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-8 w-8 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-500 truncate">Active Threats</dt>
                  <dd className="text-2xl font-bold text-slate-900">3</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow-lg rounded-lg border border-slate-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-500 truncate">Open Disputes</dt>
                  <dd className="text-2xl font-bold text-slate-900">2</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow-lg rounded-lg border border-slate-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Globe className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-500 truncate">Compliance</dt>
                  <dd className="text-2xl font-bold text-slate-900">92%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-slate-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`${
                  selectedTab === tab.id
                    ? 'border-blue-500 text-blue-500'
                    : 'border-transparent text-slate-500 hover:text-blue-500 hover:border-blue-200'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center transition-colors duration-200`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {selectedTab === 'audit' && (
        <div className="bg-white shadow-lg rounded-lg border border-slate-200">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg leading-6 font-bold text-slate-900">Security Audit Log</h3>
              <div className="flex space-x-2">
                <button className="inline-flex items-center px-3 py-2 border border-slate-200 shadow-sm text-sm leading-4 font-medium rounded-md text-slate-900 bg-white hover:bg-yellow-400 transition-colors duration-200">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </button>
                <button className="inline-flex items-center px-3 py-2 border border-slate-200 shadow-sm text-sm leading-4 font-medium rounded-md text-slate-900 bg-white hover:bg-blue-100 transition-colors duration-200">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </button>
              </div>
            </div>
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                      Type & Message
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                      User/IP
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                      Severity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {securityLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-blue-100">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-900">{log.type.replace('_', ' ').toUpperCase()}</div>
                        <div className="text-sm text-slate-500">{log.message}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900">{log.user}</div>
                        <div className="text-sm text-slate-500">{log.ip}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(log.severity)}`}>
                          {log.severity.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                          {log.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {log.timestamp}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-500 hover:text-blue-700 transition-colors duration-200">
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'disputes' && (
        <div className="space-y-6">
          {disputes.map((dispute) => (
            <div key={dispute.id} className="bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-200 border border-slate-200">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-bold text-slate-900">
                        {dispute.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(dispute.status)}`}>
                        {dispute.status.toUpperCase()}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(dispute.priority)}`}>
                        {dispute.priority.toUpperCase()} PRIORITY
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-4">
                      <div>
                        <dt className="text-sm font-medium text-slate-900">Reporter</dt>
                        <dd className="mt-1 text-sm text-slate-600">{dispute.reporter}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-slate-900">Reportee</dt>
                        <dd className="mt-1 text-sm text-slate-600">{dispute.reportee}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-slate-900">Book</dt>
                        <dd className="mt-1 text-sm text-slate-600">{dispute.bookTitle}</dd>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mb-4">{dispute.description}</p>
                    <p className="text-xs text-slate-500">Created: {dispute.createdAt}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="inline-flex items-center px-3 py-2 border border-slate-200 shadow-sm text-sm leading-4 font-medium rounded-md text-slate-900 bg-white hover:bg-yellow-400 transition-colors duration-200">
                      View Details
                    </button>
                    {dispute.status === 'active' && (
                      <>
                        <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-500 hover:bg-green-600 transition-colors duration-200">
                          Resolve
                        </button>
                        <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-900 hover:bg-blue-950 transition-colors duration-200">
                          Mediate
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedTab === 'compliance' && (
        <div className="space-y-6">
          {complianceChecks.map((category) => (
            <div key={category.category} className="bg-white shadow-lg rounded-lg border border-slate-200">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-bold text-slate-900 mb-4">{category.category}</h3>
                <div className="space-y-3">
                  {category.checks.map((check, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-blue-100 transition-colors duration-200">
                      <div className="flex-shrink-0">
                        {getStatusIcon(check.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-slate-900">{check.name}</p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(check.status)}`}>
                            {check.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600">{check.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SecurityCompliance;