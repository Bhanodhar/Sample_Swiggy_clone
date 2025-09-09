const express = require('express');
const router = express.Router();
const { vendorRegister,vendorLogin, getAllVendors, getVendorById } = require('../controllers/vendorController');

// Register route
router.post('/register', vendorRegister);
// Login route
router.post('/login', vendorLogin);

// Route to get all vendors
router.get('/all-vendors', getAllVendors);

// Route to get a single vendor by ID
router.get('/single-vendor/:Id', getVendorById);

module.exports = router;
