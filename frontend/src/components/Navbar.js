import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  const getMenuItemClasses = (path) => {
    return `nav-link ${location.pathname === path ? 'active' : ''}`;
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <div className="navbar-menu">
          <img src="/logoenetwoq.webp" alt="eNetwoq Logo" className="logo" />
          <Link to="/" className={getMenuItemClasses("/")}>
            Home
          </Link>
          {["Sales", "Admin"].includes(user.role) && (
            <Link to="/customer" className={getMenuItemClasses("/customer")}>
              Customer
            </Link>
          )}
          {user.role === "Admin" && (
            <Link to="/user-management" className={getMenuItemClasses("/user-management")}>
              Training
            </Link>
          )}
        </div>
        <div className="profile-section">
          <FaUserCircle className="user-icon"/>
          <button onClick={handleLogout} className="nav-logout-btn">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
