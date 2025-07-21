import React from 'react';
import { BookOpen, Gift, Calendar, TrendingUp, Users, Clock } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { icon: BookOpen, label: 'Pending Requests', value: '12', color: 'text-accent' },
    { icon: Gift, label: 'Books Received', value: '48', color: 'text-success' },
    { icon: Calendar, label: 'Upcoming Events', value: '3', color: 'text-secondary' },
    { icon: TrendingUp, label: 'Total Donations', value: '156', color: 'text-primary' }
  ];

  const recentRequests = [
    { id: 1, title: 'Mathematics Grade 10', status: 'Approved', quantity: 25, date: '2024-01-15' },
    { id: 2, title: 'English Literature', status: 'Pending', quantity: 15, date: '2024-01-14' },
    { id: 3, title: 'Science Textbooks', status: 'In Delivery', quantity: 30, date: '2024-01-12' }
  ];

  const upcomingEvents = [
    { id: 1, title: 'Book Drive Campaign', date: '2024-01-20', location: 'Community Center' },
    { id: 2, title: 'Reading Competition', date: '2024-01-25', location: 'Local Library' },
    { id: 3, title: 'Literacy Workshop', date: '2024-02-01', location: 'School Auditorium' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-textPrimary">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your organization.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg bg-gray-100 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-heading font-bold text-textPrimary">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Book Requests */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-heading font-semibold text-textPrimary">Recent Book Requests</h2>
            <button className="text-accent hover:text-accent/80 text-sm font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {recentRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-textPrimary">{request.title}</h3>
                  <p className="text-sm text-gray-600">Quantity: {request.quantity} books</p>
                  <p className="text-xs text-gray-500">{request.date}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  request.status === 'Approved' ? 'bg-success/10 text-success' :
                  request.status === 'Pending' ? 'bg-secondary/10 text-primary' :
                  'bg-accent/10 text-accent'
                }`}>
                  {request.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-heading font-semibold text-textPrimary">Upcoming Events</h2>
            <button className="text-accent hover:text-accent/80 text-sm font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-textPrimary">{event.title}</h3>
                  <p className="text-sm text-gray-600 flex items-center mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    {event.date}
                  </p>
                  <p className="text-xs text-gray-500">{event.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-heading font-semibold text-textPrimary mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center space-x-2 p-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
            <BookOpen className="h-5 w-5" />
            <span>Request Books</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 bg-secondary text-primary rounded-lg hover:bg-secondary/90 transition-colors">
            <Calendar className="h-5 w-5" />
            <span>Join Event</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors">
            <Users className="h-5 w-5" />
            <span>Contact Donors</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;