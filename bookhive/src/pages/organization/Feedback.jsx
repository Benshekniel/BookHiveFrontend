import React, { useState } from 'react';
import { Star, User, Gift, Calendar, MessageSquare, Plus, Filter } from 'lucide-react';

const Feedback = () => {
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const feedbacks = [
    {
      id: 1,
      donorName: 'Sarah Johnson',
      donorAvatar: 'SJ',
      bookTitle: 'Mathematics Grade 10 Textbooks',
      rating: 5,
      comment: 'Excellent donation! The textbooks were brand new and exactly what our students needed. Sarah was very responsive and helpful throughout the process.',
      date: '2024-01-20',
      status: 'completed'
    },
    {
      id: 2,
      donorName: 'Dr. Michael Chen',
      donorAvatar: 'MC',
      bookTitle: 'Science Laboratory Manuals',
      rating: 4,
      comment: 'Great quality books and fast shipping. The manuals were in excellent condition and our students love them.',
      date: '2024-01-18',
      status: 'completed'
    },
    {
      id: 3,
      donorName: 'BookWorms Foundation',
      donorAvatar: 'BF',
      bookTitle: 'English Literature Collection',
      rating: 5,
      comment: 'Amazing collection of classic literature books. The foundation was professional and the books arrived in perfect condition.',
      date: '2024-01-15',
      status: 'completed'
    },
    {
      id: 4,
      donorName: 'Jennifer Wilson',
      donorAvatar: 'JW',
      bookTitle: 'History Textbooks Grade 8',
      rating: 3,
      comment: 'Books were good but took longer than expected to arrive. Overall satisfied with the donation.',
      date: '2024-01-10',
      status: 'completed'
    }
  ];

  const pendingDonations = [
    {
      id: 1,
      donorName: 'Alex Rodriguez',
      donorAvatar: 'AR',
      bookTitle: 'Geography Textbooks',
      deliveryDate: '2024-01-22',
      status: 'delivered'
    },
    {
      id: 2,
      donorName: 'Lisa Thompson',
      donorAvatar: 'LT',
      bookTitle: 'Art & Craft Books',
      deliveryDate: '2024-01-25',
      status: 'delivered'
    }
  ];

  const filteredFeedbacks = feedbacks.filter(feedback => {
    if (filter === 'all') return true;
    if (filter === 'excellent') return feedback.rating === 5;
    if (filter === 'good') return feedback.rating === 4;
    if (filter === 'average') return feedback.rating === 3;
    if (filter === 'poor') return feedback.rating <= 2;
    return true;
  });

  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    console.log('Submitting feedback');
    setShowFeedbackForm(false);
    setRating(0);
  };

  const averageRating = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0) / feedbacks.length;

  const renderStars = (rating, interactive = false, onRate = null, onHover = null) => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      return (
        <Star
          key={index}
          className={`h-5 w-5 ${
            starValue <= (interactive ? (hoveredRating || rating) : rating)
              ? 'text-secondary fill-secondary'
              : 'text-gray-300'
          } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
          onClick={interactive ? () => onRate(starValue) : undefined}
          onMouseEnter={interactive ? () => onHover(starValue) : undefined}
          onMouseLeave={interactive ? () => onHover(0) : undefined}
        />
      );
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-textPrimary">Feedback & Reviews</h1>
          <p className="text-gray-600 mt-2">Rate your donors and share your experience</p>
        </div>
        
        <button
          onClick={() => setShowFeedbackForm(!showFeedbackForm)}
          className="flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Write Feedback</span>
        </button>
      </div>

      {/* Feedback Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <div className="text-3xl font-heading font-bold text-textPrimary mb-2">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex justify-center mb-2">
              {renderStars(Math.round(averageRating))}
            </div>
            <p className="text-sm text-gray-600">Average Rating</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <div className="text-3xl font-heading font-bold text-textPrimary mb-2">
              {feedbacks.length}
            </div>
            <p className="text-sm text-gray-600">Total Reviews</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <div className="text-3xl font-heading font-bold text-success mb-2">
              {feedbacks.filter(f => f.rating >= 4).length}
            </div>
            <p className="text-sm text-gray-600">Positive Reviews</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <div className="text-3xl font-heading font-bold text-accent mb-2">
              {pendingDonations.length}
            </div>
            <p className="text-sm text-gray-600">Pending Feedback</p>
          </div>
        </div>
      </div>

      {/* Feedback Form */}
      {showFeedbackForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-heading font-semibold text-textPrimary mb-4">
            Write New Feedback
          </h2>
          
          <form onSubmit={handleSubmitFeedback} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-textPrimary mb-2">
                  Select Donation
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors">
                  <option value="">Choose a completed donation...</option>
                  {pendingDonations.map((donation) => (
                    <option key={donation.id} value={donation.id}>
                      {donation.bookTitle} - {donation.donorName}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-textPrimary mb-2">
                  Rating
                </label>
                <div className="flex items-center space-x-1">
                  {renderStars(rating, true, setRating, setHoveredRating)}
                  <span className="ml-2 text-sm text-gray-600">
                    {rating > 0 && (
                      rating === 5 ? 'Excellent' :
                      rating === 4 ? 'Good' :
                      rating === 3 ? 'Average' :
                      rating === 2 ? 'Below Average' : 'Poor'
                    )}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-textPrimary mb-2">
                Your Review
              </label>
              <textarea
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                placeholder="Share your experience with this donor and donation..."
                required
              ></textarea>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                type="submit"
                className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Submit Feedback
              </button>
              <button
                type="button"
                onClick={() => setShowFeedbackForm(false)}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Pending Feedback */}
      {pendingDonations.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-heading font-semibold text-textPrimary mb-4">
            Pending Feedback
          </h2>
          <p className="text-gray-600 mb-4">
            You have {pendingDonations.length} completed donations waiting for your feedback.
          </p>
          
          <div className="space-y-3">
            {pendingDonations.map((donation) => (
              <div key={donation.id} className="flex items-center justify-between p-4 bg-secondary/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-medium">
                    {donation.donorAvatar}
                  </div>
                  <div>
                    <h3 className="font-medium text-textPrimary">{donation.bookTitle}</h3>
                    <p className="text-sm text-gray-600">
                      Donated by {donation.donorName} • Delivered {donation.deliveryDate}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowFeedbackForm(true)}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Write Review
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          <Filter className="h-5 w-5 text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
          >
            <option value="all">All Reviews ({feedbacks.length})</option>
            <option value="excellent">Excellent (5 stars)</option>
            <option value="good">Good (4 stars)</option>
            <option value="average">Average (3 stars)</option>
            <option value="poor">Poor (1-2 stars)</option>
          </select>
        </div>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {filteredFeedbacks.map((feedback) => (
          <div key={feedback.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-medium">
                {feedback.donorAvatar}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-textPrimary">{feedback.donorName}</h3>
                    <p className="text-sm text-gray-600">{feedback.bookTitle}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 mb-1">
                      {renderStars(feedback.rating)}
                    </div>
                    <p className="text-xs text-gray-500">{feedback.date}</p>
                  </div>
                </div>
                
                <p className="text-gray-700 leading-relaxed">{feedback.comment}</p>
                
                <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Gift className="h-4 w-4" />
                    <span>Donation completed</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{feedback.date}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredFeedbacks.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
          <p className="text-gray-500">
            {filter === 'all' 
              ? "You haven't written any reviews yet." 
              : `No ${filter} reviews found.`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default Feedback;