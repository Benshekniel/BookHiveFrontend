import React, { useState } from 'react';
import { 
  User, Mail, Phone, MapPin, Clock, Camera, Edit3, Save, X, 
  Store, Globe, Star, Calendar, Package, TrendingUp, Users, BookOpen, Award, Settings
} from 'lucide-react';

const StoreProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    storeName: 'PageTurner Books',
    storeDescription: 'A cozy independent bookstore specializing in rare finds and beloved classics. We\'ve been serving book lovers in the community for over 15 years.',
    email: 'contact@pageturnerbooks.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, Booktown, BT 12345',
    businessHours: {
      monday: '9:00 AM - 7:00 PM',
      tuesday: '9:00 AM - 7:00 PM',
      wednesday: '9:00 AM - 7:00 PM',
      thursday: '9:00 AM - 7:00 PM',
      friday: '9:00 AM - 8:00 PM',
      saturday: '10:00 AM - 6:00 PM',
      sunday: '11:00 AM - 5:00 PM'
    },
    website: 'www.pageturnerbooks.com',
    established: '2009',
    specialties: ['Classic Literature', 'Mystery & Thriller', 'Local Authors', 'Rare Books']
  });

  const [tempData, setTempData] = useState({ ...profileData });

  const stats = [
    {
      label: 'Total Books Listed',
      value: '2,847',
      change: '+12% this month',
      trend: 'up',
      icon: BookOpen,
      color: 'bg-blue-50 text-blue-600'
    },
    {
      label: 'Active Exchanges',
      value: '23',
      change: '+5 this week',
      trend: 'up',
      icon: Package,
      color: 'bg-yellow-50 text-yellow-600'
    },
    {
      label: 'Customer Rating',
      value: '4.8',
      change: '+0.2 this month',
      trend: 'up',
      icon: Star,
      color: 'bg-green-50 text-green-600'
    },
    {
      label: 'Years Active',
      value: '15',
      change: 'Since 2009',
      trend: 'neutral',
      icon: Award,
      color: 'bg-purple-50 text-purple-600'
    }
  ];

  const handleSave = () => {
    setProfileData({ ...tempData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempData({ ...profileData });
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setTempData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBusinessHoursChange = (day, value) => {
    setTempData(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: value
      }
    }));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Store Profile</h1>
            <p className="text-gray-600">Manage your bookstore information and settings</p>
          </div>
          <div className="flex items-center space-x-3">
            {isEditing ? (
              <>
                <button 
                  onClick={handleCancel}
                  className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
              </>
            ) : (
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              {stat.trend !== 'neutral' && (
                <div className={`text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  <TrendingUp className={`w-4 h-4 inline ${stat.trend === 'down' ? 'rotate-180' : ''}`} />
                </div>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className={`text-xs ${stat.trend === 'up' ? 'text-green-600' : stat.trend === 'down' ? 'text-red-600' : 'text-gray-500'}`}>
                {stat.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Store Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <Store className="w-5 h-5 text-gray-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Store Information</h3>
              <p className="text-sm text-gray-500 ml-2">Update your store details and public information</p>
            </div>

            {/* Profile Photo Section */}
            <div className="flex items-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  PB
                </div>
                {isEditing && (
                  <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Change Photo</p>
                <p className="text-xs text-gray-500">JPG, PNG or GIF. Max size 2MB</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Store Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={tempData.storeName}
                    onChange={(e) => handleInputChange('storeName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{profileData.storeName}</p>
                )}
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={tempData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{profileData.website}</p>
                )}
              </div>
            </div>

            {/* Store Description */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Store Description</label>
              {isEditing ? (
                <textarea
                  value={tempData.storeDescription}
                  onChange={(e) => handleInputChange('storeDescription', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-700 leading-relaxed">{profileData.storeDescription}</p>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <Mail className="w-5 h-5 text-gray-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={tempData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{profileData.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={tempData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{profileData.phone}</p>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Store Address</label>
              {isEditing ? (
                <input
                  type="text"
                  value={tempData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{profileData.address}</p>
              )}
            </div>
          </div>

          {/* Business Hours */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <Clock className="w-5 h-5 text-gray-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Business Hours</h3>
            </div>

            <div className="space-y-4">
              {Object.entries(profileData.businessHours).map(([day, hours]) => (
                <div key={day} className="flex items-center justify-between py-2">
                  <span className="text-gray-700 font-medium capitalize w-24">{day}:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempData.businessHours[day]}
                      onChange={(e) => handleBusinessHoursChange(day, e.target.value)}
                      className="flex-1 ml-4 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <span className="text-gray-900 flex-1 ml-4">{hours}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Store Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-5 h-5 text-gray-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Store Performance</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Monthly Sales</span>
                <span className="font-semibold text-gray-900">$12,450</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Customers</span>
                <span className="font-semibold text-gray-900">1,247</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Avg. Order Value</span>
                <span className="font-semibold text-gray-900">$28.50</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Return Rate</span>
                <span className="font-semibold text-green-600">2.1%</span>
              </div>
            </div>
          </div>

          {/* Specialties */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <BookOpen className="w-5 h-5 text-gray-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Specialties</h3>
            </div>
            <div className="space-y-2">
              {profileData.specialties.map((specialty, index) => (
                <span 
                  key={index}
                  className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mr-2 mb-2"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <Settings className="w-5 h-5 text-gray-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            </div>
            <div className="space-y-3">
              <button className="w-full flex items-center px-4 py-3 text-left text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <Users className="w-4 h-4 mr-3" />
                Manage Staff
              </button>
              <button className="w-full flex items-center px-4 py-3 text-left text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <Package className="w-4 h-4 mr-3" />
                Inventory Settings
              </button>
              <button className="w-full flex items-center px-4 py-3 text-left text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <Globe className="w-4 h-4 mr-3" />
                Store Visibility
              </button>
            </div>
          </div>

          {/* Store Since */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-sm p-6 text-white">
            <div className="flex items-center mb-2">
              <Calendar className="w-5 h-5 mr-2" />
              <h3 className="text-lg font-semibold">Established</h3>
            </div>
            <p className="text-3xl font-bold mb-1">{profileData.established}</p>
            <p className="text-blue-100">Serving the community for {new Date().getFullYear() - parseInt(profileData.established)} years</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreProfile;