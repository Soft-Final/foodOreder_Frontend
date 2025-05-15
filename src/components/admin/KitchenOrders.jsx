import React, { useState, useEffect } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { getOrders, updateOrderStatus } from "../api/menuApi";

const ORDERS_PER_PAGE = 15;

const KitchenOrders = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [updatingOrders, setUpdatingOrders] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders();
      // Sort orders by created_at in descending order (newest first)
      const sortedOrders = data.sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      );
      setOrders(sortedOrders);
      setError(null);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to fetch orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Set up polling every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const toggleStatus = async (orderNumber) => {
    try {
      // Add the order to the updating set
      setUpdatingOrders(prev => new Set([...prev, orderNumber]));
      
      await updateOrderStatus(orderNumber, "completed");
      
      // Update the local state immediately
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.order_number === orderNumber 
            ? { ...order, status: "completed" }
            : order
        )
      );
    } catch (error) {
      console.error("Failed to update order status:", error);
      if (error.message.includes("not found in localStorage")) {
        alert("Please log in again to update order status.");
      } else if (error.message.includes("permission")) {
        alert("You don't have permission to update order status. Please contact an administrator.");
      } else {
        alert("Failed to update order status. Please try again.");
      }
    } finally {
      // Remove the order from the updating set
      setUpdatingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderNumber);
        return newSet;
      });
    }
  };

  const toggleExpand = (orderNumber) => {
    setExpandedOrder(expandedOrder === orderNumber ? null : orderNumber);
  };

  const totalPages = Math.ceil(orders.length / ORDERS_PER_PAGE);
  const sortedOrders = [...orders].sort((a, b) => {
    if (a.status === b.status) return 0;
    return a.status === "in_progress" ? -1 : 1;
  });
  
  const paginatedOrders = sortedOrders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE
  );

  if (loading && orders.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D94F3C]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-4">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Kitchen Orders</h1>

      <div className="bg-white shadow-sm rounded-xl overflow-hidden">
        <table className="w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Order ID</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Time</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Amount</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Status</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map((order) => (
              <React.Fragment key={order.order_number}>
                <tr 
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                  onClick={() => toggleExpand(order.order_number)}
                >
                  <td className="px-6 py-4 text-sm text-gray-800 flex items-center gap-2">
                    {expandedOrder === order.order_number ? (
                      <ChevronUpIcon className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                    )}
                    {order.order_number}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {new Date(order.created_at).toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    ${parseFloat(order.total_price).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-white text-xs font-medium ${
                        order.status === "completed" ? "bg-green-500" : "bg-yellow-500"
                      }`}
                    >
                      {order.status === "completed" ? "Completed" : "In Progress"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStatus(order.order_number);
                      }}
                      disabled={order.status === "completed" || updatingOrders.has(order.order_number)}
                      className={`px-3 py-1 text-sm rounded-lg ${
                        order.status === "completed"
                          ? "bg-gray-400 text-white cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      } ${updatingOrders.has(order.order_number) ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {updatingOrders.has(order.order_number) 
                        ? "Updating..." 
                        : order.status === "completed" 
                          ? "Completed" 
                          : "Mark as Completed"}
                    </button>
                  </td>
                </tr>
                {expandedOrder === order.order_number && (
                  <tr className="bg-gray-50">
                    <td colSpan="5" className="px-6 py-4">
                      <div className="bg-white rounded-lg shadow-sm p-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Order Items</h3>
                        <div className="space-y-2">
                          {order.items.item_details.map((item, index) => (
                            <div key={`${order.order_number}-${item.id}-${index}`} className="flex justify-between items-center text-sm">
                              <span className="text-gray-800">
                                {item.name}
                              </span>
                              <span className="text-gray-600">
                                ${parseFloat(item.price).toFixed(2)}
                              </span>
                            </div>
                          ))}
                          <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-medium">
                            <span className="text-gray-800">Total</span>
                            <span className="text-gray-800">${parseFloat(order.total_price).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-end items-center px-6 py-4 border-t">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 mr-2 text-sm bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 ml-2 text-sm bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default KitchenOrders;
