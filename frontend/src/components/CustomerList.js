import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const CustomerList = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      if (user && user.token) {
        try {
          const response = await axios.get(`http://localhost:3000/api/customer`, {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          setCustomers(response.data);
        } catch (err) {
          setError(err.response?.data?.error || "Gagal mengambil data pelanggan.");
        }
      }
    };
    fetchCustomers();
    // Dependency array kosong agar hanya berjalan sekali saat mounting
  }, [user]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleString('id-ID', options) + ' WIB';
  };

  if (!user || !["Sales", "Admin"].includes(user.role)) return null;

  return (
    <div className="customer-list-container">
      <div className="list-header">
        <div>
          <h2 className="list-title">DATA PELANGGAN</h2>
          <p className="list-subtitle">Laporan data pelanggan yang sudah terinput</p>
        </div>
        {user.role === "Sales" && (
          <button
            className="input-customer-btn"
            onClick={() => navigate("/customer/add")}
          >
            Input Customer
          </button>
        )}
      </div>

      {error && <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}
      
      <div className="customer-card-container">
        {customers.length > 0 ? (
          customers.map((customer) => (
            <div 
              key={customer.idCustomer} 
              className="customer-card" 
              onClick={() => navigate(`/customer/${customer.idCustomer}`)}
            >
              <h3>{customer.nmCustomer}</h3>
              {customer.tglInput && (
                <p>{formatDate(customer.tglInput)}</p>
              )}
            </div>
          ))
        ) : (
          <div className="p-5 text-center text-gray-500">Tidak ada data pelanggan yang tersedia.</div>
        )}
      </div>
    </div>
  );
};

export default CustomerList;