import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard } from 'lucide-react';

function AddCard() {
  const [cardNumber, setCardNumber] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [cvv, setCvv] = useState('');
  const [showCvvTooltip, setShowCvvTooltip] = useState(false);
  const [activeInput, setActiveInput] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  const formatCardNumber = (value) => {
    const v = value.replace(/\D/g, '').slice(0, 16);
    return v.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const handleCardNumberChange = (e) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const handleValidUntilChange = (e) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    setValidUntil(value);
  };

  const isCardComplete =
    cardNumber.replace(/\s/g, '').length === 16 &&
    validUntil.length === 5 &&
    cvv.length === 3;

  const isCardExpired = () => {
    const [monthStr, yearStr] = validUntil.split('/');
    const month = parseInt(monthStr, 10);
    const year = parseInt('20' + yearStr, 10);

    if (isNaN(month) || isNaN(year)) return true;

    const now = new Date();
    const expiry = new Date(year, month - 1, 1);
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return expiry < currentMonth;
  };

  const handleSubmit = () => {
    if (isCardExpired()) {
      alert('This card is expired. Please use a valid card.');
    } else {
      setSuccessMessage('✅ Payment successful! Thank you for adding your card.');
      setTimeout(() => navigate('/payment-success'), 2000);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <span className="w-2 h-8 bg-[#D94F3C] rounded-full" />
            <h2 className="text-2xl font-semibold text-slate-800">Add New Card</h2>
          </div>
          <button
            onClick={() => navigate('/payment')}
            className="text-sm text-[#D94F3C] hover:text-[#bf3d2d] font-medium"
          >
            &larr; Payment Methods
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-medium text-slate-700">
              Card Number
            </label>
            <input
              type="text"
              value={cardNumber}
              onChange={handleCardNumberChange}
              placeholder="1234 5678 9012 3456"
              maxLength="19"
              className="w-full border border-slate-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D94F3C]"
              onFocus={() => setActiveInput('cardNumber')}
              onBlur={() => setActiveInput(null)}
            />
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block mb-1 text-sm font-medium text-slate-700">
                Valid Until
              </label>
              <input
                type="text"
                value={validUntil}
                onChange={handleValidUntilChange}
                placeholder="MM/YY"
                maxLength="5"
                className="w-full border border-slate-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D94F3C]"
                onFocus={() => setActiveInput('validUntil')}
                onBlur={() => setActiveInput(null)}
              />
            </div>

            <div className="w-1/2 relative">
              <label className="block mb-1 text-sm font-medium text-slate-700">
                CVV
                <span
                  className="ml-1 cursor-help text-[#D94F3C]"
                  onMouseEnter={() => setShowCvvTooltip(true)}
                  onMouseLeave={() => setShowCvvTooltip(false)}
                >
                  ?
                </span>
                {showCvvTooltip && (
                  <div className="absolute z-10 top-full mt-1 w-56 bg-slate-200 text-sm text-slate-800 p-2 rounded shadow">
                    Three-digit code on the back of your card
                  </div>
                )}
              </label>
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                placeholder="123"
                maxLength="3"
                className="w-full border border-slate-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D94F3C]"
                onFocus={() => setActiveInput('cvv')}
                onBlur={() => setActiveInput(null)}
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!isCardComplete}
            className={`w-full px-6 py-4 rounded-xl shadow-xl text-white font-medium flex items-center justify-center gap-3 transition-all ${
              isCardComplete
                ? 'bg-[#D94F3C] hover:bg-[#bf3d2d] hover:shadow-2xl'
                : 'bg-slate-300 cursor-not-allowed'
            }`}
          >
            <CreditCard size={20} />
            <span>Add Card</span>
          </button>

          {successMessage && (
            <div className="mt-4 text-green-600 font-medium text-center">
              {successMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddCard;
