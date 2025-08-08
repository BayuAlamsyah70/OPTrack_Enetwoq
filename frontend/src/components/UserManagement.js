import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import * as Yup from "yup";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  role: Yup.string()
    .oneOf(["Sales", "Admin", "HC", "Expert", "Trainer"])
    .required("Role is required"),
  mobileSales: Yup.string()
    .matches(/^\d*$/, "Phone number must be numeric")
    .when("role", {
      is: "Sales",
      then: (schema) => schema.optional(),
      otherwise: (schema) => schema.notRequired(),
    }),
  descSales: Yup.string().optional(),
});

const UserManagement = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    mobileSales: "",
    descSales: "",
  });
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/user", {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching users:", error));
  }, [user.token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      console.log("Submitting user:", formData); // Debug
      const response = await axios.post(
        "http://localhost:3000/api/user",
        formData,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      console.log("User created:", response.data); // Debug
      setSuccess("User created successfully");
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "",
        mobileSales: "",
        descSales: "",
      });
      // Refresh user list
      const usersResponse = await axios.get("http://localhost:3000/api/user", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setUsers(usersResponse.data);
    } catch (error) {
      console.error("Error creating user:", error);
      if (error.name === "ValidationError") {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      } else {
        setErrorMessage(error.response?.data?.error || "Failed to create user");
      }
    }
  };

  if (user.role !== "Admin") return <div>Unauthorized</div>;

  return (
    <div className="container mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      {success && <p className="text-green-500 mb-4">{success}</p>}
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Role</option>
            <option value="Sales">Sales</option>
            <option value="Admin">Admin</option>
            <option value="HC">HC</option>
            <option value="Expert">Expert</option>
            <option value="Trainer">Trainer</option>
          </select>
          {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
        </div>
        {formData.role === "Sales" && (
          <>
            <div className="mb-4">
              <label className="block text-gray-700">Mobile Sales</label>
              <input
                type="text"
                name="mobileSales"
                value={formData.mobileSales}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Enter phone number"
              />
              {errors.mobileSales && (
                <p className="text-red-500 text-sm">{errors.mobileSales}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Description Sales</label>
              <textarea
                name="descSales"
                value={formData.descSales}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Enter description"
              />
              {errors.descSales && (
                <p className="text-red-500 text-sm">{errors.descSales}</p>
              )}
            </div>
          </>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Add User
        </button>
      </form>
      <h3 className="text-xl font-bold mb-4">User List</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="border p-2">{user.name}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
