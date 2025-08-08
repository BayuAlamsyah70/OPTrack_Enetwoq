import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import { AuthContext } from "../context/AuthContext";

const LoginPage = () => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (user) return <Navigate to="/customer" />;
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoginForm />
    </div>
  );
};

export default LoginPage;