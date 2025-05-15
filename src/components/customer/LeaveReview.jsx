import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LeaveReview() {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [activeInput, setActiveInput] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = () => {
    // Here you'd send feedback to the server
    navigate("/thank-you");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-6 sm:p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-[#D94F3C] mb-6 text-center">
          Rate Your Order
        </h2>

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
            Your feedback (max 150 characters)
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
          />
          <div className="text-sm text-slate-500 text-right">
            {feedback.length}/150
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!rating}
          className={`w-full py-3 rounded-xl shadow-md font-semibold transition-all ${
            rating
              ? "bg-[#D94F3C] hover:bg-[#bf3d2d] text-white"
              : "bg-slate-300 text-white cursor-not-allowed"
          }`}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default LeaveReview;
