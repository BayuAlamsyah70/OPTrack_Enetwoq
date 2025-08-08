import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import * as Yup from "yup";

const validationSchema = Yup.object({
  nmCustomer: Yup.string().required("Customer name is required"),
  emailCustomer: Yup.string().email("Invalid email format").required("Email is required"),
  mobileCustomer: Yup.string().matches(/^\d+$/, "Phone number must be numeric").optional(),
  addrCustomer: Yup.string().optional(),
  corpCustomer: Yup.string().optional(),
  idStatCustomer: Yup.number().required("Status is required"),
  descCustomer: Yup.string().optional(),
});

const CustomerForm = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nmCustomer: "",
    emailCustomer: "",
    mobileCustomer: "",
    addrCustomer: "",
    corpCustomer: "",
    idStatCustomer: "",
    descCustomer: "",
  });
  const [statusOptions, setStatusOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user && user.token) {
      axios
        .get("http://localhost:3000/api/customer/status", {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        .then((response) => setStatusOptions(response.data))
        .catch((error) => console.error("Error fetching status options:", error));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await validationSchema.validate(formData, { abortsEarly: false });
      await axios.post("http://localhost:3000/api/customer", formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setSuccess("Customer created successfully!");
      setFormData({
        nmCustomer: "",
        emailCustomer: "",
        mobileCustomer: "",
        addrCustomer: "",
        corpCustomer: "",
        idStatCustomer: "",
        descCustomer: "",
      });
      setTimeout(() => navigate('/customer'), 2000);
    } catch (error) {
      if (error.name === "ValidationError") {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      } else {
        console.error("Error creating customer:", error.response?.data?.error);
      }
    }
  };

  return (
    <div className="form-wrapper">
      <button className="btn-back" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
      </button>
      <h2 className="form-title">FORM INPUT CUSTOMER</h2>
      {success && <div className="p-4 mb-4 text-sm bg-green-100 text-green-700 rounded-lg">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="nmCustomer"
            placeholder="Customer Name"
            value={formData.nmCustomer}
            onChange={handleChange}
          />
          {errors.nmCustomer && <p className="error">{errors.nmCustomer}</p>}
        </div>
        <div className="form-group">
          <label>Mobile Phone</label>
          <input
            type="text"
            name="mobileCustomer"
            placeholder="Customer Mobile Phone"
            value={formData.mobileCustomer}
            onChange={handleChange}
          />
          {errors.mobileCustomer && <p className="error">{errors.mobileCustomer}</p>}
        </div>
        <div className="form-group">
          <label>E-Mail</label>
          <input
            type="email"
            name="emailCustomer"
            placeholder="Customer Email"
            value={formData.emailCustomer}
            onChange={handleChange}
          />
          {errors.emailCustomer && <p className="error">{errors.emailCustomer}</p>}
        </div>
        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            name="addrCustomer"
            placeholder="Customer Address"
            value={formData.addrCustomer}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Corporation</label>
          <input
            type="text"
            name="corpCustomer"
            placeholder="Customer Corporation"
            value={formData.corpCustomer}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Status Customer</label>
          <select
            name="idStatCustomer"
            value={formData.idStatCustomer}
            onChange={handleChange}
          >
            <option value="">Select Status Customer</option>
            {statusOptions.map((status) => (
              <option key={status.idStatCustomer} value={status.idStatCustomer}>
                {status.nmStatCustomer}
              </option>
            ))}
          </select>
          {errors.idStatCustomer && <p className="error">{errors.idStatCustomer}</p>}
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="descCustomer"
            placeholder="Customer Description"
            value={formData.descCustomer}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn-submit">
          Add Customer
        </button>
      </form>
    </div>
  );
};

export default CustomerForm;
