import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import UserManagement from "../components/UserManagement";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";

const UserManagementPage = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;
  if (!user || user.role !== "Admin") return <Navigate to="/login" />;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <UserManagement />
    </div>
  );
};

export default UserManagementPage;
