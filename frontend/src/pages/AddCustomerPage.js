import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import CustomerForm from "../components/CustomerForm";
import { AuthContext } from "../context/AuthContext";

const AddCustomerPage = () => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (!user || user.role !== "Sales") return <Navigate to="/login" />;
  return (
    <div className="min-h-screen">
      <Navbar />
      <CustomerForm />
    </div>
  );
};

export default AddCustomerPage;