import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-lg font-bold">
          OPTrack
        </Link>
        <div>
          {["Sales", "Admin"].includes(user.role) && (
            <Link to="/customer" className="text-white mr-4">
              Customer
            </Link>
          )}
          {user.role === "Admin" && (
            <Link to="/user-management" className="text-white mr-4">
              User Management
            </Link>
          )}
          <button onClick={handleLogout} className="text-white">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
