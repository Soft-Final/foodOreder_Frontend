import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { submitFeedback } from "../api/menuApi";

function LeaveReview() {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [activeInput, setActiveInput] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId;
  const orderDetails = location.state?.orderDetails;

  useEffect(() => {
    console.log('LeaveReview mounted with state:', {
      orderId,
      orderDetails,
      fullLocationState: location.state
    });
    
    if (!orderId) {
      setError("Order ID is missing. Please try again from your order history.");
    }
  }, [orderId, orderDetails, location.state]);

  const handleSubmit = async () => {
    if (!orderId) {
      setError("Order ID is missing. Please try again from your order history.");
      return;
    }

    if (!rating || rating < 1 || rating > 5) {
      setError("Please select a valid rating between 1 and 5.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // Use the order number directly without any transformation
      const feedbackData = {
        order_id: orderId,
        rating: rating,
        feedback: feedback.trim() || ""
      };

      console.log('Submitting feedback with data:', feedbackData);
      console.log('Original order details:', orderDetails);

      await submitFeedback(feedbackData);
      navigate("/thank-you");
    } catch (err) {
      console.error("Error submitting feedback:", err);
      setError(err.message || "Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-6 sm:p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-[#D94F3C] mb-6 text-center">
          Rate Your Order
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-center mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`text-3xl cursor-pointer transition-colors ${
                star <= rating ? "text-yellow-400" : "text-slate-300"
              }`}
              onClick={() => setRating(star)}
            >
              ★
            </span>
          ))}
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-slate-700">
            Your feedback (optional, max 150 characters)
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            maxLength={150}
            className={`w-full border px-4 py-2 rounded-xl focus:outline-none focus:ring-2 ${
              activeInput === "feedback" ? "ring-[#D94F3C]" : "ring-slate-200"
            }`}
            onFocus={() => setActiveInput("feedback")}
            onBlur={() => setActiveInput(null)}
            placeholder="Share your experience with us..."
          />
          <div className="text-sm text-slate-500 text-right">
            {feedback.length}/150
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!rating || isSubmitting}
          className={`w-full py-3 rounded-xl shadow-md font-semibold transition-all ${
            rating && !isSubmitting
              ? "bg-[#D94F3C] hover:bg-[#bf3d2d] text-white"
              : "bg-slate-300 text-white cursor-not-allowed"
          }`}
        >
          {isSubmitting ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default LeaveReview;
