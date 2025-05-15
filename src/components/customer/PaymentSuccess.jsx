import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { useCart } from "../customer/CartContext";
import { createOrder } from "../api/menuApi";

function PaymentSuccess() {
  const navigate = useNavigate();
  const { order, setOrder } = useCart();
  const [orderNumber, setOrderNumber] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const orderAttemptedRef = useRef(false);

  useEffect(() => {
    const createNewOrder = async () => {
      // Check if we have items and haven't attempted to create an order yet
      if (!order?.items || orderAttemptedRef.current) {
        console.log('Skipping order creation:', { 
          hasItems: !!order?.items, 
          alreadyAttempted: orderAttemptedRef.current,
          orderObject: order
        });
        return;
      }
      
      try {
        setIsLoading(true);
        orderAttemptedRef.current = true;
        console.log('Creating order with items:', order.items);
        const response = await createOrder(order.items);
        console.log('Order creation response:', response);
        setOrderNumber(response.order_number);
        // Update the order with the backend order number
        setOrder(prev => ({
          ...prev,
          orderNumber: response.order_number
        }));
      } catch (error) {
        console.error("Failed to create order:", error);
        console.error("Full error details:", {
          message: error.message,
          stack: error.stack,
          order: order,
          orderAttempted: orderAttemptedRef.current,
          orderItems: order?.items
        });
        setError("Failed to create order. Please contact staff for assistance.");
        // Reset the ref if order creation failed
        orderAttemptedRef.current = false;
      } finally {
        setIsLoading(false);
      }
    };

    createNewOrder();
  }, [order, setOrder]);

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
          {isLoading ? (
            <div className="animate-pulse">Loading order number...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            orderNumber
          )}
        </div>

        <button
          onClick={() => {
            console.log('Navigating to review with order number:', orderNumber);
            navigate("/leave-review", { 
              state: { 
                orderId: orderNumber,
                orderDetails: order // Pass the full order details for debugging
              } 
            });
          }}
          className="bg-[#D94F3C] text-white px-6 py-3 rounded-xl hover:bg-[#bf3d2d] transition-colors"
        >
          Leave a Review
        </button>
      </div>
    </div>
  );
}

export default PaymentSuccess;
