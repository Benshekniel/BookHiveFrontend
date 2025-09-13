import React, { useState, useEffect, useContext } from 'react';
import { Star, User, Gift, Calendar, MessageSquare, Plus, Filter, AlertCircle, CheckCircle } from 'lucide-react';
import { feedbackService } from '../../services/organizationService';
// Import organization context (uncomment and replace with your actual context)
// import { OrganizationContext } from '../../contexts/OrganizationContext';

const ORG_ID = 1; // TODO: Replace with real orgId from context or props

const Feedback = () => {
  // Replace with actual context usage when available
  // const { organizationId } = useContext(OrganizationContext);
  const organizationId = localStorage.getItem('orgId') || 1; // Fallback to local storage or default
  
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedbacks, setFeedbacks] = useState([]);
  const [pendingDonations, setPendingDonations] = useState([]);
  const [selectedDonation, setSelectedDonation] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    loadFeedbackData();
  }, []);

  const loadFeedbackData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [feedbackData, donationsData] = await Promise.all([
        feedbackService.getByOrganization(ORG_ID),
        feedbackService.getPendingDonations(ORG_ID)
      ]);
      setFeedbacks(Array.isArray(feedbackData) ? feedbackData : []);
      setPendingDonations(Array.isArray(donationsData) ? donationsData : []);
    } catch (err) {
      console.error('Error loading feedback data:', err);
      setError('Failed to load feedback data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    
    if (!selectedDonation) {
      setError('Please select a donation.');
      return;
    }
    
    if (rating === 0) {
      setError('Please provide a rating.');
      return;
    }

    setSubmitting(true);
    setError(null);
    
    try {
      await feedbackService.create({
        organizationId: organizationId,
        donationId: selectedDonation,
        rating,
        comment: comment.trim(),
      });
      
      setSuccess('Feedback submitted successfully!');
      await loadFeedbackData();
      
      // Reset form
      setShowFeedbackForm(false);
      setRating(0);
      setComment('');
      setSelectedDonation('');
      
      // Auto-dismiss success message after 5 seconds
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setShowFeedbackForm(false);
    setRating(0);
    setComment('');
    setSelectedDonation('');
    setError(null);
  };

  const filteredFeedbacks = feedbacks.filter(feedback => {
    if (filter === 'all') return true;
    if (filter === 'excellent') return feedback.rating === 5;
    if (filter === 'good') return feedback.rating === 4;
    if (filter === 'average') return feedback.rating === 3;
    if (filter === 'poor') return feedback.rating <= 2;
    return true;
  });

  const averageRating = feedbacks.length > 0
    ? feedbacks.reduce((sum, feedback) => sum + (feedback.rating || 0), 0) / feedbacks.length
    : 0;

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

  const getRatingText = (rating) => {
    switch (rating) {
      case 5: return 'Excellent';
      case 4: return 'Good';
      case 3: return 'Average';
      case 2: return 'Below Average';
      case 1: return 'Poor';
      default: return '';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-gray-600">Loading feedback...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-textPrimary">Feedback & Reviews</h1>
          <p className="text-gray-600 mt-2">Rate your donors and share your experience</p>
        </div>
        
        <button
          onClick={() => setShowFeedbackForm(!showFeedbackForm)}
          disabled={pendingDonations.length === 0}
          className="flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="h-5 w-5" />
          <span>Write Feedback</span>
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
          <p className="text-green-800">{success}</p>
          <button onClick={() => setSuccess(null)} className="ml-auto text-green-600 hover:text-green-700">
            ×
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <p className="text-red-800">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto text-red-600 hover:text-red-700">
            ×
          </button>
        </div>
      )}

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
                  Select Donation *
                </label>
                <select
                  value={selectedDonation}
                  onChange={(e) => setSelectedDonation(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                  required
                  disabled={submitting}
                >
                  <option value="">Choose a completed donation...</option>
                  {pendingDonations.map((donation) => (
                    <option key={donation.id} value={donation.id}>
                      {donation.bookTitle || donation.title || 'Untitled'} - {donation.donorName || 'Anonymous Donor'}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-textPrimary mb-2">
                  Rating *
                </label>
                <div className="flex items-center space-x-1">
                  {renderStars(rating, true, setRating, setHoveredRating)}
                  <span className="ml-2 text-sm text-gray-600">
                    {rating > 0 && getRatingText(rating)}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-textPrimary mb-2">
                Your Review *
              </label>
              <textarea
                rows="4"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                placeholder="Share your experience with this donor and donation..."
                required
                disabled={submitting}
                maxLength={500}
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">{comment.length}/500 characters</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                type="submit"
                className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={submitting || rating === 0}
              >
                {submitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={submitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Pending Feedback */}
      {pendingDonations.length > 0 && !showFeedbackForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-heading font-semibold text-textPrimary mb-4">
            Pending Feedback
          </h2>
          <p className="text-gray-600 mb-4">
            You have {pendingDonations.length} completed donation{pendingDonations.length !== 1 ? 's' : ''} waiting for your feedback.
          </p>
          
          <div className="space-y-3">
            {pendingDonations.slice(0, 3).map((donation) => (
              <div key={donation.id} className="flex items-center justify-between p-4 bg-secondary/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-medium text-sm">
                    {donation.donorAvatar || donation.donorName?.charAt(0) || 'D'}
                  </div>
                  <div>
                    <h3 className="font-medium text-textPrimary">
                      {donation.bookTitle || donation.title || 'Book Donation'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Donated by {donation.donorName || 'Anonymous'} • 
                      Delivered {formatDate(donation.deliveryDate || donation.date || donation.donationDate)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedDonation(donation.id.toString());
                    setShowFeedbackForm(true);
                  }}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Write Review
                </button>
              </div>
            ))}
            {pendingDonations.length > 3 && (
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  and {pendingDonations.length - 3} more...
                </p>
              </div>
            )}
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
            <option value="excellent">Excellent (5 stars) ({feedbacks.filter(f => f.rating === 5).length})</option>
            <option value="good">Good (4 stars) ({feedbacks.filter(f => f.rating === 4).length})</option>
            <option value="average">Average (3 stars) ({feedbacks.filter(f => f.rating === 3).length})</option>
            <option value="poor">Poor (1-2 stars) ({feedbacks.filter(f => f.rating <= 2).length})</option>
          </select>
        </div>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {filteredFeedbacks.map((feedback) => (
          <div key={feedback.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-medium">
                {feedback.donorAvatar || feedback.donorName?.charAt(0) || 'D'}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-textPrimary">
                      {feedback.donorName || 'Anonymous Donor'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {feedback.bookTitle || feedback.title || feedback.donationTitle || 'Book Donation'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 mb-1">
                      {renderStars(feedback.rating || 0)}
                    </div>
                    <p className="text-xs text-gray-500">
                      {formatDate(feedback.date || feedback.createdAt)}
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-700 leading-relaxed mb-4">
                  {feedback.comment || 'No comment provided'}
                </p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Gift className="h-4 w-4" />
                    <span>Donation completed</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(feedback.date || feedback.createdAt)}</span>
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
          {pendingDonations.length > 0 && filter === 'all' && (
            <button
              onClick={() => setShowFeedbackForm(true)}
              className="mt-4 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Write your first review
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Feedback;