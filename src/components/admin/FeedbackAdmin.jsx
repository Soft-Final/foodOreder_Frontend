import { useState, useEffect } from 'react';
import {
    ArrowUturnLeftIcon as ReplyIcon,
    TrashIcon,
    FlagIcon,
  } from '@heroicons/react/24/outline';
import { getFeedbacks } from '../api/menuApi';

const FeedbackAdmin = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoading(true);
        const data = await getFeedbacks();
        setFeedbacks(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching feedbacks:", err);
        setError("Failed to fetch feedbacks. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const handleTabChange = (tabIndex) => {
    setSelectedTab(tabIndex);
  };

  const handleReply = (feedback) => {
    setSelectedFeedback(feedback);
    setReplyText(feedback.reply || '');
    setReplyDialogOpen(true);
  };

  const handleCloseReplyDialog = () => {
    setReplyDialogOpen(false);
    setSelectedFeedback(null);
    setReplyText('');
  };

  const handleSubmitReply = () => {
    // In a real app, this would update the feedback in the database

    handleCloseReplyDialog();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredFeedbacks = feedbacks.filter((feedback) => {
    const isFeedback = feedback.star_rating >= 3;
    if (selectedTab === 0) return isFeedback;
    if (selectedTab === 1) return !isFeedback;
    return true;
  });

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D94F3C]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Customer Feedback</h1>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-4">
          <button
            onClick={() => handleTabChange(0)}
            className={`pb-4 px-1 ${
              selectedTab === 0 
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            } font-medium`}
          >
            Feedback
          </button>
          <button
            onClick={() => handleTabChange(1)}
            className={`pb-4 px-1 ${
              selectedTab === 1
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            } font-medium`}
          >
            Complaints
          </button>
        </div>
      </div>

      {/* Feedback Cards */}
      <div className="space-y-4">
        {filteredFeedbacks.map((feedback) => (
          <div key={feedback.id} className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Order #{feedback.order_number}</h3>
              </div>

              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < feedback.star_rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-500">
                  {new Date(feedback.created_at).toLocaleDateString()}
                </span>
              </div>

              <p className="text-gray-600 mb-4">{feedback.feedback || "No comment provided"}</p>
            </div>
          </div>
        ))}

        {filteredFeedbacks.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No {selectedTab === 0 ? 'feedback' : 'complaints'} found
          </div>
        )}
      </div>

      {/* Reply Dialog */}
      {replyDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold">
                Reply to {selectedFeedback?.customerName}'s {selectedFeedback?.type}
              </h3>
            </div>
            
            <div className="p-6">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your response here..."
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={handleCloseReplyDialog}
                className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReply}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Send Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackAdmin;