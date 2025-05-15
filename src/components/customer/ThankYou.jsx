import React from 'react';
import { useNavigate } from 'react-router-dom';

function ThankYou() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white p-6 sm:p-8 rounded-xl shadow-lg text-center">
        <h2 className="text-2xl font-bold text-[#D94F3C] mb-4">
          Thank you for your feedback!
        </h2>
        <p className="text-slate-600 mb-6">
          We appreciate you taking the time to help us improve our service.
        </p>

        <button
          className="w-full py-3 rounded-xl bg-[#D94F3C] hover:bg-[#bf3d2d] text-white font-semibold transition-all shadow-md"
          onClick={() => navigate('/menu')}
        >
          Make Another Order
        </button>
      </div>
    </div>
  );
}

export default ThankYou;
