import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.get("http://localhost:3000/api/auth/verify", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUser({ token, ...response.data });
        setLoading(false);
      })
      .catch((error) => {
        localStorage.removeItem("token");
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", { email, password });
      const { token, role, userId } = response.data;
      localStorage.setItem("token", token);
      setUser({ token, role, userId });
      return true;
    } catch (error) {
      throw error.response?.data?.error || "Login failed";
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
