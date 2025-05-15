import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet } from 'lucide-react';

function CashPayment() {
  const [needsChange, setNeedsChange] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = () => {
    // In a real app, you'd record this preference (e.g., via API or context)
    navigate('/payment-success');
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto min-h-screen bg-slate-50">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <span className="w-2 h-8 bg-[#D94F3C] rounded-full" />
            <h2 className="text-2xl font-semibold text-slate-800">
              Cash Payment
            </h2>
          </div>
          <button
            onClick={() => navigate('/payment')}
            className="text-sm text-[#D94F3C] hover:text-[#bf3d2d] font-medium"
          >
            &larr; Payment Methods
          </button>
        </div>

        <div className="mb-6 text-slate-600 leading-relaxed">
          You have selected to pay with <strong className="text-[#D94F3C]">cash</strong>. 
          Please pay at the counter when you receive your order.
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-[#D94F3C] text-white px-6 py-4 rounded-xl shadow-xl hover:bg-[#bf3d2d] hover:shadow-2xl transition-all flex items-center justify-center gap-3"
        >
          <Wallet size={20} />
          <span className="font-medium">Confirm Cash Payment</span>
        </button>
      </div>
    </div>
  );
}

export default CashPayment;