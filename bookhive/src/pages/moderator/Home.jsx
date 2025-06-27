import StatsCard from '../../components/shared/StatsCard';
import InfoCard from '../../components/shared/InfoCard';
import {
  Users,
  BookOpen,
  Heart,
  CheckCircle,
  Flag,
  BookHeart,
  BookMarked,
  Shield,
  Bell,
  Trophy,
  BadgeDollarSign,
  ShoppingCart,
  Award
} from 'lucide-react';

const Home = () => {
  const stats = [
    {
      title: 'Pending Registrations',
      value: '24',
      icon: Users,
      change: '+12% from yesterday',
      changeType: 'positive'
    },
    {
      title: 'Revenue (2025)',
      value: '$24,680',
      icon: BadgeDollarSign,
      change: '+15% from last month',
      changeType: 'positive'
    },
    {
      title: 'Charity Events',
      value: '8',
      icon: Heart,
      change: '3 ending soon',
      changeType: 'neutral'
    },
    {
      title: 'Reported Content',
      value: '7',
      icon: Flag,
      change: 'Needs attention',
      changeType: 'negative'
    },
    {
      title: 'Active Borrows',
      value: '1,247',
      icon: BookHeart,
      change: '+200 new'
    },
    {
      title: 'Active Bids',
      value: '897',
      icon: BookMarked,
      change: '+50 new'
    },
    {
      title: 'Active Book Circles',
      value: '156',
      icon: BookOpen,
      change: '+5 new this week',
      changeType: 'positive'
    },
    {
      title: 'Book purchases',
      value: '143',
      icon: ShoppingCart,
      change: '+15 new this week',
      changeType: 'positive'
    },

  ];

  const supportTickets = [
    {
      id: 'TK-1001',
      user: 'john_reader_42',
      subject: 'Unable to complete book exchange',
      category: 'Transaction',
      priority: 'high',
      status: 'open',
      time: '2 hours ago'
    },
    {
      id: 'TK-1002',
      user: 'new_user_sarah',
      subject: 'Account verification issues',
      category: 'Account',
      priority: 'medium',
      status: 'in-progress',
      time: '4 hours ago'
    },
    {
      id: 'TK-1003',
      user: 'bookworm_mike',
      subject: 'TrustScore calculation error',
      category: 'Technical',
      priority: 'low',
      status: 'resolved',
      time: '1 day ago'
    }
  ];

  const topDonors = [
    { name: 'City Public Library', books: 450, rank: 1 },
    { name: 'BookLovers Foundation', books: 320, rank: 2 },
    { name: 'Community Reading Center', books: 280, rank: 3 },
    { name: 'Educational Trust', books: 195, rank: 4 }
  ];

  const cardData = [
    {
      title: "Charity Book Requests",
      icon: Heart,
      items: [
        {
          title: "Children's Education Foundation",
          subtitle: 'Requesting 50 educational books',
          status: 'Pending',
        },
        {
          title: 'Local Library Initiative',
          subtitle: 'Requesting 30 fiction books',
          status: 'Approved',
        },
      ],
    },
    {
      title: "Book Circle Updates",
      icon: Bell,
      items: [
        {
          title: 'Mystery Lovers Circle',
          subtitle: 'New discussion: "Best thriller of 2025"',
          status: null,
        },
        {
          title: 'Sci-Fi Enthusiasts',
          subtitle: 'Book review posted for "Future Worlds"',
          status: null,
        },
      ],
    },
    {
      title: "Writing Competitions",
      icon: Trophy,
      items: [
        {
          title: 'Summer Short Story Contest',
          subtitle: '47 submissions received',
          status: 'Active',
        },
        {
          title: 'Poetry Challenge 2025',
          subtitle: 'Judging in progress',
          status: 'Judging',
        },
      ],
    },
    {
      title: "Compliance Tasks",
      icon: Shield,
      items: [
        {
          title: 'Content Review',
          subtitle: '12 flagged items pending',
          status: 'Urgent',
        },
        {
          title: 'User Reports',
          subtitle: '3 new reports to review',
          status: 'New',
        },
      ],
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'registration',
      message: 'New user registration: Sarah Chen',
      time: '2 minutes ago',
      priority: 'high'
    },
    {
      id: 2,
      type: 'report',
      message: 'Content reported in "Modern Fiction" circle',
      time: '15 minutes ago',
      priority: 'high'
    },
    {
      id: 3,
      type: 'charity',
      message: 'New charity donation request from City Library',
      time: '1 hour ago',
      priority: 'medium'
    },
    {
      id: 4,
      type: 'competition',
      message: 'Poetry competition voting deadline approaching',
      time: '2 hours ago',
      priority: 'medium'
    },
    {
      id: 5,
      type: 'support',
      message: 'Support ticket #1247 requires escalation',
      time: '3 hours ago',
      priority: 'low'
    }
  ];

  const quickActions = [
    { title: 'Review Registrations', description: '24 pending approvals', action: 'users', color: 'bg-blue-500' },
    { title: 'Handle Reports', description: '7 content reports', action: 'compliance', color: 'bg-red-500' },
    { title: 'Charity Requests', description: '3 awaiting review', action: 'charity', color: 'bg-green-500' },
    { title: 'Support Tickets', description: '12 open tickets', action: 'support', color: 'bg-yellow-500' }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-error';
      case 'medium': return 'border-l-secondary';
      case 'low': return 'border-l-success';
      default: return 'border-l-gray-300';
    }
  };

  // Add this function to handle status color for support tickets
  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-700';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-700';
      case 'resolved':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6 p-2 bg-gray-50 min-h-screen">

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Centered Last Two */}
      {/* <div className="flex justify-center gap-6 flex-wrap">
        {stats.slice(0,4).map((stat, index) => (
          <div key={index + 4} className="w-[300px]"> 
            <StatsCard {...stat} />
          </div>
        ))}
      </div> */}

      {/* Quick Actions */}
      <div className="bg-cardBg rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-textPrimary mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <div key={index} className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
              <div className={`w-3 h-3 rounded-full ${action.color} mb-3`}></div>
              <h3 className="font-semibold text-textPrimary">{action.title}</h3>
              <p className="text-gray-600 text-sm mt-1">{action.description}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Support Tickets & Donor Recognition */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Support Tickets */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Support Tickets</h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View All</button>
          </div>
          <div className="space-y-3">
            {supportTickets.map((ticket) => (
              <div
                key={ticket.id}
                className={`p-4 rounded-lg border-l-4 ${getPriorityColor(ticket.priority)} bg-gray-50 border border-gray-200`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{ticket.subject}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  User: {ticket.user} • Category: {ticket.category} • Priority: {ticket.priority} • {ticket.time}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Donor Recognition */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Top Donors</h2>
            <Award className="w-6 h-6 text-yellow-500" />
          </div>
          <div className="space-y-3">
            {topDonors.map((donor) => (
              <div key={donor.rank} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${donor.rank === 1 ? 'bg-yellow-500' :
                    donor.rank === 2 ? 'bg-gray-400' :
                      donor.rank === 3 ? 'bg-orange-400' : 'bg-blue-500'
                    }`}>
                    {donor.rank}
                  </div>
                  <span className="font-medium text-gray-900">{donor.name}</span>
                </div>
                <span className="text-blue-600 font-semibold">{donor.books} books</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activities</h2>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View All</button>
        </div>
        <div className="space-y-3">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className={`p-4 rounded-lg border-l-4 ${getPriorityColor(activity.priority)} bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-900 font-medium">{activity.message}</p>
                  <p className="text-gray-500 text-sm mt-1">{activity.time}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${activity.priority === 'high' ? 'bg-red-100 text-red-700' :
                      activity.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                    }`}>
                    {activity.priority}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cardData.map((card, index) => (
          <InfoCard key={index} {...card} />
        ))}
      </div>

      {/* Platform Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-cardBg rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-textPrimary mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Platform Uptime</span>
              <span className="flex items-center text-success">
                <CheckCircle className="w-4 h-4 mr-1" />
                99.9%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Active Users</span>
              <span className="text-textPrimary font-medium">2,847</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Books in Circulation</span>
              <span className="text-textPrimary font-medium">15,623</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Avg Response Time</span>
              <span className="text-textPrimary font-medium">1.2s</span>
            </div>
          </div>
        </div>

        <div className="bg-cardBg rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-textPrimary mb-4">Moderation Summary</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Actions Today</span>
              <span className="text-textPrimary font-medium">47</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Users Approved</span>
              <span className="text-success font-medium">23</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Content Moderated</span>
              <span className="text-textPrimary font-medium">12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Disputes Resolved</span>
              <span className="text-success font-medium">8</span>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default Home;