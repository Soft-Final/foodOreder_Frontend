// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import Layout         from './Layout';

// admin
import Dashboard      from './components/admin/Dashboard';
import FeedbackAdmin  from './components/admin/FeedbackAdmin';
import TableQR        from './components/admin/TableQR';
import KitchenOrders  from './components/admin/KitchenOrders';
import MenuManagement from './components/admin/MenuManagement';

// public customer
import MenuPage       from './components/customer/MenuPage';
import Checkout       from './components/customer/Checkout';
import PaymentMethod  from './components/customer/PaymentMethod';
import AddCard        from './components/customer/AddCard';
import CashPayment    from './components/customer/CashPayment';
import PaymentSuccess from './components/customer/PaymentSuccess';
import ThankYou       from './components/customer/ThankYou';
import LeaveReview    from './components/customer/LeaveReview';

// auth
import Login          from './components/admin/Login';
import Register       from './components/admin/Register';
import ForgotPassword from './components/admin/ForgotPassword';
import ResetPassword  from './components/admin/ResetPassword';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public auth */}
        <Route path="/login"           element={<Login />} />
        <Route path="/register"        element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password"  element={<ResetPassword />} />

        {/* Public customer */}
        <Route path="/menu"            element={<MenuPage />} />
        <Route path="/checkout"        element={<Checkout />} />
        <Route path="/payment"         element={<PaymentMethod />} />
        <Route path="/add-card"        element={<AddCard />} />
        <Route path="/cash"            element={<CashPayment />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/thank-you"       element={<ThankYou />} />
        <Route path="/leave-review"    element={<LeaveReview />} />

        {/* ADMIN only */}
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* ADMIN & KITCHEN */}
        <Route
          path="/qr"
          element={
            <ProtectedRoute allowedRoles={['ADMIN','KITCHEN']}>
              <Layout>
                <TableQR />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/feedback-admin"
          element={
            <ProtectedRoute allowedRoles={['ADMIN','KITCHEN']}>
              <Layout>
                <FeedbackAdmin />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* KITCHEN only */}
        <Route
          path="/kitchen-orders"
          element={
            <ProtectedRoute allowedRoles={['KITCHEN']}>
              <Layout>
                <KitchenOrders />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/menu-management"
          element={
            <ProtectedRoute allowedRoles={['KITCHEN']}>
              <Layout>
                <MenuManagement />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Catch-all 404 */}
        <Route
          path="*"
          element={<div className="p-8 text-center">Page not found</div>}
        />
      </Routes>
    </Router>
  );
}

export default App;
