import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import {
  ChartBarIcon,
  FireIcon,
  CheckCircleIcon,
  ClockIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { getWeeklySales, getAnalytics, getMenuPopularity, getOrders, getAverageRating } from '../api/menuApi';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="h-full bg-white rounded-2xl shadow-lg hover:-translate-y-1 transition-transform duration-200">
    <div className="p-6">
      <div className="flex items-center mb-4">
        <div className={`w-12 h-12 rounded-full ${color} bg-opacity-20 flex items-center justify-center mr-4`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
        </div>
      </div>
      <div className="h-1 rounded-full bg-gray-100">
        <div className={`h-full rounded-full ${color} w-full`}></div>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [stats, setStats] = useState({
    totalOrders: 0,
    activeOrders: 0,
    menuItems: 0,
    averageRating: 4.5,
  });
  const [orderStatus, setOrderStatus] = useState([]);
  const [popularItems, setPopularItems] = useState([]);
  const [totalItemsOrdered, setTotalItemsOrdered] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch weekly sales
        const salesData = await getWeeklySales();
        const transformedSalesData = Object.entries(salesData.weekly_sales).map(([day, sales]) => ({
          name: day,
          sales: sales
        }));
        setSalesData(transformedSalesData);
        setDateRange({
          start: salesData.week_start,
          end: salesData.week_end
        });

        // Fetch analytics
        const analyticsData = await getAnalytics();
        setStats({
          totalOrders: analyticsData.total_orders,
          activeOrders: analyticsData.active_orders,
          menuItems: analyticsData.menu_items,
          averageRating: 4.5,
        });

        // Calculate order status for pie chart
        const completedOrders = analyticsData.total_orders - analyticsData.active_orders;
        setOrderStatus([
          { name: 'Completed', value: completedOrders },
          { name: 'In Progress', value: analyticsData.active_orders },
        ]);

        // Fetch menu popularity
        const popularityData = await getMenuPopularity();
        setPopularItems(popularityData.popular_items);
        setTotalItemsOrdered(popularityData.total_items_ordered);

        // Fetch recent orders
        const ordersData = await getOrders();
        // Sort orders by creation date and take the most recent 4
        const sortedOrders = ordersData.sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        ).slice(0, 4);
        
        setRecentOrders(sortedOrders.map(order => ({
          id: `#${order.order_number}`,
          amount: parseFloat(order.total_price) || 0, // Convert to number and handle null/undefined
          status: order.status.toLowerCase(),
          created_at: order.created_at
        })));

        // Fetch average rating
        const ratingData = await getAverageRating();
        setStats(prevStats => ({
          ...prevStats,
          averageRating: ratingData.average_rating
        }));

        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statusChip = (status) => {
    const config = {
      completed: {
        color: "bg-green-100 text-green-600",
        icon: <CheckCircleIcon className="w-4 h-4 mr-1" />,
      },
      preparing: {
        color: "bg-yellow-100 text-yellow-600",
        icon: <ClockIcon className="w-4 h-4 mr-1" />,
      },
      pending: {
        color: "bg-blue-100 text-blue-600",
        icon: <ClockIcon className="w-4 h-4 mr-1" />,
      },
      in_progress: {
        color: "bg-yellow-100 text-yellow-600",
        icon: <ClockIcon className="w-4 h-4 mr-1" />,
      },
      ready: {
        color: "bg-green-100 text-green-600",
        icon: <CheckCircleIcon className="w-4 h-4 mr-1" />,
      },
      cancelled: {
        color: "bg-red-100 text-red-600",
        icon: <ClockIcon className="w-4 h-4 mr-1" />,
      }
    };

    const statusConfig = config[status] || {
      color: "bg-gray-100 text-gray-600",
      icon: <ClockIcon className="w-4 h-4 mr-1" />,
    };

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}>
        {statusConfig.icon}
        {status.replace('_', ' ')}
      </span>
    );
  };

  if (loading) {
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
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Restaurant Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Orders" value={stats.totalOrders} icon={DocumentTextIcon} color="text-blue-600" />
        <StatCard title="Active Orders" value={stats.activeOrders} icon={ArrowTrendingUpIcon} color="text-green-600" />
        <StatCard title="Menu Items" value={stats.menuItems} icon={ChartBarIcon} color="text-yellow-600" />
        <StatCard title="Average Rating" value={stats.averageRating} icon={StarIcon} color="text-red-600" />
      </div>

      {/* Sales and Pie Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Sales Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Weekly Sales Overview</h2>
            {dateRange.start && dateRange.end && (
              <span className="text-sm text-gray-500">
                {new Date(dateRange.start).toLocaleDateString()} - {new Date(dateRange.end).toLocaleDateString()}
              </span>
            )}
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                <Legend />
                <Bar dataKey="sales" name="Sales ($)" fill="#2E7D32" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Status Distribution</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatus}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  dataKey="value"
                >
                  {orderStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Orders and Trending Items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Orders</h2>
          <div className="overflow-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100">
                      <td className="px-4 py-4 font-medium text-gray-900">{order.id}</td>
                      <td className="px-4 py-4 text-right font-medium">
                        ${typeof order.amount === 'number' ? order.amount.toFixed(2) : '0.00'}
                      </td>
                      <td className="px-4 py-4 text-center">{statusChip(order.status)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-4 py-4 text-center text-gray-500">
                      No recent orders
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Trending Items */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Trending Items</h2>
            <span className="text-sm text-gray-500">Total Orders: {totalItemsOrdered}</span>
          </div>
          <div className="space-y-4">
            {popularItems.map((item, index) => (
              <div key={item.name} className={`flex items-center p-4 rounded-xl ${index === 0 ? "bg-orange-50" : "hover:bg-gray-50"}`}>
                <FireIcon className={`w-6 h-6 mr-4 ${index === 0 ? "text-orange-500" : "text-gray-400"}`} />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.order_count} orders</p>
                </div>
                <span className="font-bold text-gray-700">{item.percentage.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Items Table
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Popular Menu Items</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item Name</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Sales</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {popularItems.map((item) => (
                <tr key={item.name} className="border-b border-gray-100">
                  <td className="px-4 py-3 text-gray-900 font-medium">{item.name}</td>
                  <td className="px-4 py-3 text-right">{item.sales}</td>
                  <td className="px-4 py-3 text-right">{item.percentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> */}
    </div>
  );
};

export default Dashboard;
