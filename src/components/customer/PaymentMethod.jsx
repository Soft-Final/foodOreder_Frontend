import React from "react";
import { useNavigate } from "react-router-dom";

function PaymentMethod() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="max-w-xl w-full p-6 bg-white rounded-xl shadow-md text-center border border-slate-200">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Choose Payment Method
        </h2>
        <div className="grid gap-4">
          <div
            className="cursor-pointer border-2 border-[#D94F3C] p-4 rounded-lg hover:bg-[#D94F3C] hover:text-white transition"
            onClick={() => navigate("/add-card")}
          >
            💳 Credit/Debit Card
          </div>
          <div
            className="cursor-pointer border-2 border-[#D94F3C] p-4 rounded-lg hover:bg-[#D94F3C] hover:text-white transition"
            onClick={() => navigate("/cash")}
          >
            💵 Cash
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentMethod;
