import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaArrowLeft, FaDownload, FaUserCircle, FaHome, FaUsers } from "react-icons/fa";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const CustomerDetail = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const contentRef = useRef();

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

  const handleExportPdf = () => {
    const input = contentRef.current;
    if (input) {
      html2canvas(input, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps= pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Laporan_Pelanggan_${customer.nmCustomer}.pdf`);
      });
    }
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (error) return <div className="text-center mt-20 text-red-500">{error}</div>;
  if (!customer) return <div className="text-center mt-20">Data pelanggan tidak ditemukan.</div>;

  return (
    <div className="customer-detail-container">
      <div className="detail-header">
        <div>
          <h2 className="detail-title">DATA PELANGGAN</h2>
          <p className="detail-subtitle">Laporan Informasi Pelanggan</p>
        </div>
        <button onClick={handleExportPdf} className="export-pdf-btn">
          <FaDownload /> Export to PDF
        </button>
      </div>

      <div ref={contentRef} className="detail-content-to-pdf">
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
              <span className="info-label">Mobile Phone :</span>
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
              <span className="info-status">{customer.nmStatCustomer}</span>
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
        <FaArrowLeft /> Back
      </button>
    </div>
  );
};

export default CustomerDetail;