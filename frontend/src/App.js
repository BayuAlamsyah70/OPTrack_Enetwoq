import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import CustomerPage from "./pages/CustomerPage";
import AddCustomerPage from "./pages/AddCustomerPage";
import UserManagementPage from "./pages/UserManagementPage";
import CustomerDetailPage from "./pages/CustomerDetailPage"; // Import komponen halaman detail baru
import './App.css';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/customer" element={<CustomerPage />} />
          <Route path="/customer/add" element={<AddCustomerPage />} />
          <Route path="/customer/:id" element={<CustomerDetailPage />} /> {/* Rute baru untuk detail pelanggan */}
          <Route path="/user-management" element={<UserManagementPage />} />
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;