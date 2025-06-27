import { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  Plus, 
  MessageSquare, 
  FileText, 
  Video, 
  Phone,
  Mail,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const Support = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const supportTickets = [
    {
      id: 'SUP001',
      title: 'Delivery tracking system not updating',
      category: 'Technical',
      priority: 'high',
      status: 'open',
      created: '2024-03-05',
      lastUpdate: '2 hours ago'
    },
    {
      id: 'SUP002',
      title: 'Rider unable to access route information',
      category: 'Technical',
      priority: 'medium',
      status: 'in-progress',
      created: '2024-03-04',
      lastUpdate: '1 day ago'
    },
    {
      id: 'SUP003',
      title: 'Request for additional delivery vehicles',
      category: 'Operational',
      priority: 'low',
      status: 'resolved',
      created: '2024-03-01',
      lastUpdate: '3 days ago'
    }
  ];

  const faqItems = [
    {
      question: 'How do I assign a rider to a new route?',
      answer: 'Go to the Routes page, select the route you want to assign, and use the rider assignment dropdown to select an available rider.',
      category: 'Routes'
    },
    {
      question: 'What should I do if a delivery is delayed?',
      answer: 'Check the Deliveries page for real-time updates. You can reassign the delivery to another rider or contact the customer directly through the messaging system.',
      category: 'Deliveries'
    },
    {
      question: 'How can I view performance analytics?',
      answer: 'Navigate to the Performance page where you can view detailed reports on delivery success rates, rider performance, and operational metrics.',
      category: 'Analytics'
    },
    {
      question: 'How do I approve new rider registrations?',
      answer: 'Go to the Agents page where pending registration requests are displayed at the top. Review the documents and click approve or reject.',
      category: 'Agents'
    },
    {
      question: 'How can I optimize route efficiency?',
      answer: 'Use the Routes page map view to analyze performance. Look for routes with low efficiency scores and consider redistributing deliveries or adjusting coverage areas.',
      category: 'Routes'
    },
    {
      question: 'What do the different delivery statuses mean?',
      answer: 'Pending: Order received but not assigned. Picked Up: Rider has collected the item. In Transit: On the way to destination. Delivered: Successfully completed. Delayed: Behind schedule.',
      category: 'Deliveries'
    }
  ];

  const resources = [
    {
      title: 'Hub Manager User Guide',
      description: 'Complete guide for managing your delivery hub',
      type: 'document',
      icon: FileText
    },
    {
      title: 'Video Tutorial: Route Management',
      description: 'Learn how to create and manage delivery routes',
      type: 'video',
      icon: Video
    },
    {
      title: 'Best Practices for Rider Management',
      description: 'Tips for effectively managing your delivery team',
      type: 'document',
      icon: FileText
    },
    {
      title: 'Troubleshooting Common Issues',
      description: 'Solutions to frequently encountered problems',
      type: 'document',
      icon: FileText
    },
    {
      title: 'Performance Analytics Guide',
      description: 'Understanding and using performance metrics',
      type: 'document',
      icon: FileText
    },
    {
      title: 'Video Tutorial: Map-Based Route Optimization',
      description: 'How to use the visual map for route improvements',
      type: 'video',
      icon: Video
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-600';
      case 'in-progress': return 'bg-yellow-100 text-yellow-600';
      case 'resolved': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-400 text-blue-900';
      case 'low': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const filteredFAQ = faqItems.filter(item =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-2 bg-gray-50 min-h-screen">

      {/* Quick Contact */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
          <Phone className="w-8 h-8 text-blue-500 mx-auto mb-3" />
          <h3 className="font-semibold text-slate-900 mb-2">Emergency Support</h3>
          <p className="text-sm text-gray-600 mb-3">24/7 emergency assistance</p>
          <p className="font-medium text-blue-500">+1 (555) 123-4567</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
          <Mail className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
          <h3 className="font-semibold text-slate-900 mb-2">Email Support</h3>
          <p className="text-sm text-gray-600 mb-3">Response within 4 hours</p>
          <p className="font-medium text-yellow-500">support@hubmanager.com</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
          <MessageSquare className="w-8 h-8 text-green-500 mx-auto mb-3" />
          <h3 className="font-semibold text-slate-900 mb-2">Live Chat</h3>
          <p className="text-sm text-gray-600 mb-3">Instant messaging support</p>
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors">
            Start Chat
          </button>
        </div>
      </div>

      {/* Support Tickets */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-slate-900 mb-4" style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}>Your Support Tickets</h2>
        <div className="space-y-3">
          {supportTickets.map((ticket) => (
            <div key={ticket.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="font-medium text-slate-900">{ticket.id}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}>
                      {ticket.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                  <h3 className="font-medium text-slate-900 mb-1">{ticket.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Category: {ticket.category}</span>
                    <span>Created: {ticket.created}</span>
                    <span>Last update: {ticket.lastUpdate}</span>
                  </div>
                </div>
                <button className="text-blue-500 hover:text-blue-600">
                  <MessageSquare className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* FAQ Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-slate-900 mb-4" style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}>Frequently Asked Questions</h2>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search FAQ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredFAQ.map((item, index) => (
              <details key={index} className="border border-gray-200 rounded-lg">
                <summary className="p-3 cursor-pointer hover:bg-gray-50 transition-colors font-medium text-slate-900">
                  {item.question}
                </summary>
                <div className="p-3 pt-0 text-sm text-gray-600">
                  <span className="inline-block bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs mb-2">
                    {item.category}
                  </span>
                  <p>{item.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Resources */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-slate-900 mb-4" style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}>Help Resources</h2>
          <div className="space-y-3">
            {resources.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-start space-x-3">
                    <Icon className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-900 mb-1">{resource.title}</h3>
                      <p className="text-sm text-gray-600">{resource.description}</p>
                      <span className="inline-block mt-2 text-xs text-blue-500 font-medium">
                        {resource.type === 'video' ? 'Watch Video' : 'Read More'} →
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;