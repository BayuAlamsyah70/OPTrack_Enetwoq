// frontend/src/controllers/customerController.js

const Customer = require("../models/customer");
const pool = require("../config/database");

const createCustomer = async (req, res) => {
  try {
    const customerData = req.body;
    const userId = req.user.id;
    console.log(
      "Creating customer with data:",
      customerData,
      "userId:",
      userId
    );
    const [sales] = await pool.query(
      "SELECT idSales FROM sales WHERE userId = ?",
      [userId]
    );
    if (!sales.length) {
      console.log("No Sales record found for userId:", userId);
      return res
        .status(400)
        .json({ error: "No Sales record found for this user" });
    }
    const idSales = sales[0].idSales;

    const newCustomer = await Customer.create(customerData, idSales);
    res.status(201).json({ message: "Customer created", data: newCustomer });
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ error: error.sqlMessage || "Server error" });
  }
};

const getCustomers = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    const statusFilter = req.query.status;
    console.log("Fetching customers for user:", { userId, role, statusFilter });

    let customers;
    if (role === "Admin" || role === "Sales") {
      customers = await Customer.findAll(statusFilter);
    } else {
      console.log("Unauthorized role:", role);
      return res.status(403).json({ error: "Unauthorized access" });
    }

    res.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ error: error.sqlMessage || "Server error" });
  }
};

const getStatusOptions = async (req, res) => {
  try {
    const statusOptions = await Customer.findStatusOptions();
    res.json(statusOptions);
  } catch (error) {
    console.error("Error fetching status options:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// FUNGSI BARU: Mengambil detail pelanggan berdasarkan ID
const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.json(customer);
  } catch (error) {
    console.error("Error fetching customer by ID:", error);
    res.status(500).json({ error: error.sqlMessage || "Server error" });
  }
};

module.exports = { createCustomer, getCustomers, getStatusOptions, getCustomerById };