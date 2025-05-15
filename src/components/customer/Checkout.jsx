import { useCart } from "../customer/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

const Checkout = ({ onClose }) => {
  const { cart, setOrder } = useCart();
  const total = cart.reduce((acc, item) => acc + item.price, 0).toFixed(2);
  const navigate = useNavigate();

  const handleProceed = () => {
    const orderData = {
      orderNumber: `ORD-${Math.floor(Math.random() * 100000)}`,
      items: [...cart],
    };
    setOrder(orderData);
    navigate("/payment");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl bg-white p-6 rounded-xl shadow-lg border border-slate-200">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <span className="w-2 h-8 bg-[#D94F3C] rounded-full" />
            <h2 className="text-2xl font-semibold text-slate-800">
              Checkout Summary
            </h2>
          </div>
          <Link
            to="/menu"
            onClick={onClose}
            className="text-sm text-[#D94F3C] hover:text-[#bf3d2d] font-medium"
          >
            Back to Menu
          </Link>
        </div>

        <ul className="mb-6 space-y-4">
          {cart.map((item, index) => (
            <li
              key={index}
              className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-100"
            >
              <span className="text-slate-800 font-medium">{item.name}</span>
              <span className="text-slate-600">${item.price.toFixed(2)}</span>
            </li>
          ))}
        </ul>

        <div className="flex justify-between items-center mb-8 p-4 bg-slate-50 rounded-lg border border-slate-100">
          <span className="text-lg font-bold text-slate-800">Total:</span>
          <span className="text-xl font-bold text-[#D94F3C]">${total}</span>
        </div>

        <button
          onClick={handleProceed}
          className="w-full bg-[#D94F3C] text-white px-6 py-4 rounded-xl shadow-xl hover:bg-[#bf3d2d] hover:shadow-2xl transition-all flex items-center justify-center gap-3"
        >
          <ShoppingCart size={20} />
          <span className="font-medium">Proceed to Payment</span>
        </button>
      </div>
    </div>
  );
};

export default Checkout;
