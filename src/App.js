import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/admin/Dashboard";
import MenuManagement from "./components/admin/MenuManagement";
import TableQR from "./components/admin/TableQR";
import FeedbackAdmin from "./components/admin/FeedbackAdmin";
import Layout from "./Layout"; // 👈 Create and import Layout

import PaymentMethod from "./components/customer/PaymentMethod";
import AddCard from "./components/customer/AddCard";
import CashPayment from "./components/customer/CashPayment";
import ThankYou from "./components/customer/ThankYou";
import Login from "./components/admin/Login";
import ForgotPassword from "./components/admin/ForgotPassword";
import ResetPassword from "./components/admin/ResetPassword";
import Register from "./components/admin/Register";
import MenuPage from "./components/customer/MenuPage";
import Checkout from "./components/customer/Checkout";
import PaymentSuccess from "./components/customer/PaymentSuccess";
import LeaveReview from "./components/customer/LeaveReview";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route
          path="/"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/feedback-admin"
          element={
            <Layout>
              <FeedbackAdmin />
            </Layout>
          }
        />
        <Route
          path="/menu-management"
          element={
            <Layout>
              <MenuManagement />
            </Layout>
          }
        />
        <Route
          path="/qr"
          element={
            <Layout>
              <TableQR />
            </Layout>
          }
        />

        <Route path="/menu" element={<MenuPage />} />
        <Route path="/checkout" element={<Checkout />} />

        <Route path="/payment" element={<PaymentMethod />} />
        <Route path="/add-card" element={<AddCard />} />
        <Route path="/cash" element={<CashPayment />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/leave-review" element={<LeaveReview />} />

      </Routes>
    </Router>
  );
}

export default App;
