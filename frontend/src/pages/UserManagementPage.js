import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import UserManagement from "../components/UserManagement";
import { AuthContext } from "../context/AuthContext";

const UserManagementPage = () => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (!user || user.role !== "Admin") return <Navigate to="/login" />;
  return (
    <div className="min-h-screen">
      <Navbar />
      <UserManagement />
    </div>
  );
};

export default UserManagementPage;