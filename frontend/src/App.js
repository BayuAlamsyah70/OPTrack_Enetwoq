import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Login from "./pages/Login";
import Customer from "./pages/Customer";
import UserManagementPage from "./pages/UserManagement";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AuthContext.Consumer>
          {({ user, loading }) => {
            if (loading) return <div>Loading...</div>;
            return (
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  path="/customer"
                  element={user ? <Customer /> : <Login />}
                />
                <Route
                  path="/user-management"
                  element={
                    user && user.role === "Admin" ? (
                      <UserManagementPage />
                    ) : (
                      <Login />
                    )
                  }
                />
                <Route path="/" element={user ? <Customer /> : <Login />} />
              </Routes>
            );
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    </Router>
  );
};

export default App;
