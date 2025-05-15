import { useCart } from "../customer/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

const Checkout = ({ onClose }) => {
  const { cart, setOrder } = useCart();
  const total = cart.reduce((acc, item) => {
    const quantity = item.quantity || 1;
    const price = parseFloat(item.price) || 0;
    return acc + (quantity * price);
  }, 0).toFixed(2);
  
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
              <div className="flex flex-col">
                <span className="text-slate-800 font-medium">{item.name}</span>
                <span className="text-sm text-slate-500">Quantity: {item.quantity || 1}</span>
              </div>
              <span className="text-slate-600">
                ${((item.quantity || 1) * (parseFloat(item.price) || 0)).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>

        <div className="border-t border-slate-200 pt-4 mb-6">
          <div className="flex justify-between items-center text-lg font-semibold text-slate-800">
            <span>Total:</span>
            <span>${total}</span>
          </div>
        </div>

        <button
          onClick={handleProceed}
          className="w-full bg-[#D94F3C] text-white py-3 rounded-xl hover:bg-[#bf3d2d] transition-colors font-medium"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default Checkout;
