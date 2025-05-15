import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { useCart } from "../customer/CartContext";

function PaymentSuccess() {
  const navigate = useNavigate();
  const { order } = useCart();
  const [canReview, setCanReview] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(20 * 60); // 20 minutes

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanReview(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  if (!order) {
    return (
      <div className="text-center mt-20 text-[#D94F3C] text-lg font-semibold">
        No order found. Please return to the menu and place your order again.
      </div>
    );
  }

  const total = order.items
    .reduce((acc, item) => {
      const quantity = item.quantity || 1;
      return acc + quantity * item.price;
    }, 0)
    .toFixed(2);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl bg-white p-6 sm:p-8 rounded-xl shadow-lg text-center">
        <CheckCircle size={64} className="mx-auto text-[#3AB65C] mb-4" />

        <h2 className="text-2xl font-bold text-[#3AB65C] mb-2">
          Payment Successful!
        </h2>
        <p className="text-slate-600 mb-6">
          Thank you for your order. Your food is being prepared and will be ready
          soon.
        </p>

        <div className="bg-slate-100 p-4 rounded-lg text-left mb-6">
          <h3 className="text-lg font-semibold text-[#D94F3C] mb-3">
            Order Summary
          </h3>
          <ul className="space-y-2">
            {order.items.map((item, index) => (
              <li key={index} className="flex justify-between text-slate-800">
                <span>
                  {(item.quantity || 1)}× {item.name}
                </span>
                <span>
                  ${(item.price * (item.quantity || 1)).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
          <div className="border-t border-slate-300 mt-4 pt-3 flex justify-between font-semibold text-[#D94F3C]">
            <span>Total:</span>
            <span>${total}</span>
          </div>
        </div>

        <div className="text-sm text-slate-600 mb-2">
          Show this number when picking up your order:
        </div>
        <div className="text-xl font-bold text-[#D94F3C] mb-6">
          {order.orderNumber}
        </div>

        <button
          disabled={!canReview}
          onClick={() => navigate("/leave-review")}
          className={`w-full py-3 rounded-xl shadow-md font-semibold transition-all ${
            canReview
              ? "bg-[#D94F3C] hover:bg-[#bf3d2d] text-white"
              : "bg-slate-300 text-white cursor-not-allowed"
          }`}
        >
          {canReview
            ? "Leave Review"
            : `Leave Review in ${formatTime(secondsLeft)}`}
        </button>
      </div>
    </div>
  );
}

export default PaymentSuccess;
