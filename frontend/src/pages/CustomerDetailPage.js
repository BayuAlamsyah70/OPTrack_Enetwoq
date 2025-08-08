import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import CustomerDetail from "../components/CustomerDetail";
import { AuthContext } from "../context/AuthContext";

const CustomerDetailPage = () => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (!user || !["Sales", "Admin"].includes(user.role)) return <Navigate to="/login" />;
  return (
    <div className="min-h-screen">
      <Navbar />
      <CustomerDetail />
    </div>
  );
};

export default CustomerDetailPage;