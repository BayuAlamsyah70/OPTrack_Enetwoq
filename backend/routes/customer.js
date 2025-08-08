const express = require("express");
const router = express.Router();
const {
  createCustomer,
  getCustomers,
  getStatusOptions,
} = require("../controllers/customerController");
const authMiddleware = require("../middleware/authMiddleware");
const {
  customerValidationRules,
  validate,
} = require("../middleware/validateInput");

router.post(
  "/",
  authMiddleware(["Sales"]),
  customerValidationRules(),
  validate,
  createCustomer
);
router.get("/", authMiddleware(["Sales", "Admin"]), getCustomers);
router.get("/status", authMiddleware(["Sales", "Admin"]), getStatusOptions);

module.exports = router;
