import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import CustomerForm from "../components/CustomerForm";
import CustomerReport from "../components/CustomerReport";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";

const Customer = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;
  if (!user || !["Sales", "Admin"].includes(user.role))
    return <Navigate to="/login" />;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-4">
        {user.role === "Sales" && <CustomerForm />}
        <CustomerReport />
      </div>
    </div>
  );
};

export default Customer;
