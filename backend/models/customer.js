// frontend/src/models/customer.js

const pool = require("../config/database");

const Customer = {
  async create(customerData, idSales, connection = pool) {
    const {
      nmCustomer,
      mobileCustomer,
      emailCustomer,
      addrCustomer,
      corpCustomer,
      idStatCustomer,
      descCustomer,
    } = customerData;
    const [result] = await connection.query(
      `INSERT INTO customer (nmCustomer, mobileCustomer, emailCustomer, addrCustomer, corpCustomer, idStatCustomer, descCustomer, idSales)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nmCustomer,
        mobileCustomer || null,
        emailCustomer,
        addrCustomer || null,
        corpCustomer || null,
        idStatCustomer,
        descCustomer || null,
        idSales,
      ]
    );
    return { idCustomer: result.insertId, ...customerData, idSales };
  },

  async findBySalesId(idSales, statusFilter) {
    const query = `
      SELECT c.*, c.tglInput, sc.nmStatCustomer, s.nmSales
      FROM customer c
      JOIN statcustomer sc ON c.idStatCustomer = sc.idStatCustomer
      JOIN sales s ON c.idSales = s.idSales
      WHERE c.idSales = ? ${statusFilter ? "AND c.idStatCustomer = ?" : ""}
    `;
    const params = statusFilter ? [idSales, statusFilter] : [idSales];
    const [rows] = await pool.query(query, params);
    return rows;
  },

  async findAll(statusFilter) {
    const query = `
      SELECT c.*, c.tglInput, sc.nmStatCustomer, s.nmSales
      FROM customer c
      JOIN statcustomer sc ON c.idStatCustomer = sc.idStatCustomer
      JOIN sales s ON c.idSales = s.idSales
      ${statusFilter ? "WHERE c.idStatCustomer = ?" : ""}
    `;
    const params = statusFilter ? [statusFilter] : [];
    const [rows] = await pool.query(query, params);
    return rows;
  },

  async findStatusOptions() {
    const [rows] = await pool.query(
      "SELECT idStatCustomer, nmStatCustomer FROM statcustomer"
    );
    return rows;
  },
  
  // FUNGSI BARU: Mengambil satu data pelanggan berdasarkan ID
  async findById(id) {
    const query = `
      SELECT c.*, sc.nmStatCustomer, s.nmSales
      FROM customer c
      JOIN statcustomer sc ON c.idStatCustomer = sc.idStatCustomer
      JOIN sales s ON c.idSales = s.idSales
      WHERE c.idCustomer = ?
    `;
    const [rows] = await pool.query(query, [id]);
    return rows[0]; // Mengembalikan satu objek pelanggan
  }
};

module.exports = Customer;
