const Vendor = require('../models/Vendor');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const dotEnv = require('dotenv')

dotEnv.config()

JWT_SECRET=process.env.whatisyourname

// Register a new vendor
const vendorRegister = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if all fields are provided
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Please provide all fields." });
        }

        // Check if email already exists
        const existingVendor = await Vendor.findOne({ email });
        if (existingVendor) {
            return res.status(400).json({ message: "Email already exists." });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new vendor instance
        const newVendor = new Vendor({
            username,
            email,
            password: hashedPassword
        });

        // Save to database
        await newVendor.save();

        // Send success response
        res.status(201).json({ message: "Vendor registered successfully." });
        console.log("registered")
    } catch (error) {
        console.error("Error in vendor registration:", error);
        res.status(500).json({ message: "Server error." });
    }
};



// Vendor login
const vendorLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if all fields are provided
        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password." });
        }

        // Find vendor by email
        const vendor = await Vendor.findOne({ email });
        if (!vendor) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        // Compare provided password with hashed password
        const isMatch = await bcrypt.compare(password, vendor.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

         // Generate JWT token
        const token = jwt.sign(
            { vendorId: vendor._id},
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        const vendorId = vendor._id;
        

        // Send success response (You can later add token generation here)
        res.status(200).json({ message: "Login successful.", token, vendorId });
        console.log(email)
    } catch (error) {
        console.error("Error in vendor login:", error);
        res.status(500).json({ message: "Server error." });
    }
};


// Get all vendors
const getAllVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find().populate('firm');   // Fetch all vendors
        res.status(200).json({ vendors });
    } catch (error) {
        console.error("Error fetching vendors:", error);
        res.status(500).json({ message: "Server error." });
    }
};


// Get single vendor by ID
const getVendorById = async (req, res) => {
    const vendorId = req.params.id;
    try {
        const vendor = await Vendor.findById(vendorId).populate('firm');

        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found." });
        }
        const vendorFirmId = vendor.firm[0]._id;
        res.status(200).json({ vendorId,vendorFirmId, vendor });
    } catch (error) {
        console.error("Error fetching vendor:", error);
        res.status(500).json({ message: "Server error." });
    }
};


module.exports = { vendorRegister, vendorLogin, getAllVendors, getVendorById };
