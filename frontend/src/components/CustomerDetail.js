// src/components/CustomerDetail.js

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaArrowLeft, FaDownload, FaUserCircle, FaHome, FaUsers } from "react-icons/fa";
import { PDFDownloadLink } from '@react-pdf/renderer'; // PERUBAHAN: Import PDFDownloadLink
import PdfTemplate from './pdfTemplate'; // Import template PDF yang baru

const CustomerDetail = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // PERUBAHAN: Hapus useRef, karena tidak lagi mengambil screenshot

  useEffect(() => {
    const fetchCustomerDetail = async () => {
      if (user && user.token && id) {
        try {
          const response = await axios.get(`http://localhost:3000/api/customer/${id}`, {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          setCustomer(response.data);
          setLoading(false);
        } catch (err) {
          console.error("Error fetching customer detail:", err);
          setError("Gagal mengambil detail pelanggan.");
          setLoading(false);
        }
      }
    };
    fetchCustomerDetail();
  }, [user, id]);

  // PERUBAHAN: Hapus fungsi handleExportPdf
  
  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (error) return <div className="text-center mt-20 text-red-500">{error}</div>;
  if (!customer) return <div className="text-center mt-20">Data pelanggan tidak ditemukan.</div>;

  return (
    <div className="customer-detail-container">
      <div className="detail-header">
        <div>
          <h2 className="detail-title">DETAIL PELANGGAN</h2>
          <p className="detail-subtitle">Informasi Lengkap Pelanggan</p>
        </div>

        {/* PERUBAHAN: Tombol Export diganti dengan PDFDownloadLink */}
        <PDFDownloadLink
          document={<PdfTemplate customer={customer} />}
          fileName={`Laporan_Pelanggan_${customer.nmCustomer}.pdf`}
          className="export-pdf-btn"
        >
          {({ blob, url, loading, error }) =>
            loading ? 'Membuat PDF...' : <><FaDownload /> Export to PDF</>
          }
        </PDFDownloadLink>
      </div>
      
      <div className="detail-content"> 
        <div className="info-cards-container">
          <div className="info-card">
            <h3 className="info-card-title">
              <FaUserCircle className="info-icon" /> Informasi Pelanggan
            </h3>
            <div className="info-group">
              <span className="info-label">Nama :</span>
              <span className="info-value">{customer.nmCustomer}</span>
            </div>
            <div className="info-group">
              <span className="info-label">Email :</span>
              <span className="info-value">{customer.emailCustomer}</span>
            </div>
            <div className="info-group">
              <span className="info-label">Telepon :</span>
              <span className="info-value">{customer.mobileCustomer || "-"}</span>
            </div>
          </div>

          <div className="info-card">
            <h3 className="info-card-title">
              <FaHome className="info-icon" /> Informasi Bisnis
            </h3>
            <div className="info-group">
              <span className="info-label">Alamat :</span>
              <span className="info-value">{customer.addrCustomer || "-"}</span>
            </div>
            <div className="info-group">
              <span className="info-label">Perusahaan :</span>
              <span className="info-value">{customer.corpCustomer || "-"}</span>
            </div>
            <div className="info-group">
              <span className="info-label">Status :</span>
              <span 
                className={`info-status ${
                  customer.nmStatCustomer === 'Active' 
                  ? 'status-active' 
                  : 'status-prospect'
                }`}
              >
                {customer.nmStatCustomer}
              </span>
            </div>
          </div>
        </div>

        <div className="description-card">
          <h3 className="info-card-title">
            <FaUsers className="info-icon" /> Deskripsi Pelanggan
          </h3>
          <p className="description-text">{customer.descCustomer || "Tidak ada deskripsi."}</p>
        </div>
      </div>
      
      <button onClick={() => navigate(-1)} className="back-btn">
        <FaArrowLeft /> Kembali
      </button>
    </div>
  );
};

export default CustomerDetail;