import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import * as Yup from "yup";

const validationSchema = Yup.object({
  nmCustomer: Yup.string().required("Customer name is required"),
  emailCustomer: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  mobileCustomer: Yup.string()
    .matches(/^\d+$/, "Phone number must be numeric")
    .optional(),
  addrCustomer: Yup.string().optional(),
  corpCustomer: Yup.string().optional(),
  idStatCustomer: Yup.number().required("Status is required"),
  descCustomer: Yup.string().optional(),
});

const CustomerForm = () => {
  const { user } = useContext(AuthContext);
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
    axios
      .get("http://localhost:3000/api/customer/status", {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((response) => setStatusOptions(response.data))
      .catch((error) => console.error("Error fetching status options:", error));
  }, [user.token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      await axios.post("http://localhost:3000/api/customer", formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setSuccess("Customer created successfully");
      setFormData({
        nmCustomer: "",
        emailCustomer: "",
        mobileCustomer: "",
        addrCustomer: "",
        corpCustomer: "",
        idStatCustomer: "",
        descCustomer: "",
      });
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
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Add Customer</h2>
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="nmCustomer"
            value={formData.nmCustomer}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {errors.nmCustomer && (
            <p className="text-red-500 text-sm">{errors.nmCustomer}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="emailCustomer"
            value={formData.emailCustomer}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {errors.emailCustomer && (
            <p className="text-red-500 text-sm">{errors.emailCustomer}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Phone</label>
          <input
            type="text"
            name="mobileCustomer"
            value={formData.mobileCustomer}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {errors.mobileCustomer && (
            <p className="text-red-500 text-sm">{errors.mobileCustomer}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Address</label>
          <input
            type="text"
            name="addrCustomer"
            value={formData.addrCustomer}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Company</label>
          <input
            type="text"
            name="corpCustomer"
            value={formData.corpCustomer}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Status</label>
          <select
            name="idStatCustomer"
            value={formData.idStatCustomer}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Status</option>
            {statusOptions.map((status) => (
              <option key={status.idStatCustomer} value={status.idStatCustomer}>
                {status.nmStatCustomer}
              </option>
            ))}
          </select>
          {errors.idStatCustomer && (
            <p className="text-red-500 text-sm">{errors.idStatCustomer}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            name="descCustomer"
            value={formData.descCustomer}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default CustomerForm;
