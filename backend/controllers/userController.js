const User = require("../models/user");
const bcrypt = require("bcrypt");
const pool = require("../config/database");

const createUser = async (req, res) => {
  let connection;
  try {
    const { name, email, password, role, mobileSales, descSales } = req.body;
    console.log("Creating user:", {
      name,
      email,
      role,
      mobileSales,
      descSales,
    }); // Debug

    // Validasi role
    if (!["Sales", "Admin", "HC", "Expert", "Trainer"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    // Cek apakah email sudah digunakan
    const [existingUser] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Mulai transaksi
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Buat user di tabel users
    const userResult = await User.create(
      { name, email, password: hashedPassword, role },
      connection
    );
    const userId = userResult.insertId;
    console.log("User created with ID:", userId); // Debug

    // Jika role Sales, buat entri di tabel sales
    if (role === "Sales") {
      const salesResult = await User.createSales(
        { nmSales: name, emailSales: email, mobileSales, descSales, userId },
        connection
      );
      console.log("Sales record created with idSales:", salesResult.insertId); // Debug
    }

    // Commit transaksi
    await connection.commit();
    res.status(201).json({ message: "User created", id: userId });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("Error creating user:", error);
    res
      .status(500)
      .json({ error: error.sqlMessage || error.message || "Server error" });
  } finally {
    if (connection) connection.release();
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { createUser, getUsers };
