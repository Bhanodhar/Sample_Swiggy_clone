const Vendor = require('../models/Vendor');
const jwt = require('jsonwebtoken');
const dotEnv = require('dotenv');

dotEnv.config();

const JWT_SECRET = process.env.whatisyourname;

const verifyToken =async (req, res, next) => {
    try {
        // Get token from headers
        const token = req.headers.token

        if (!token) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        const decoded = jwt.verify(token,JWT_SECRET)
        const vendor  = await Vendor.findById(decoded.vendorId)

        if (!vendor) {
            return res.status(404).json({error: "vendor not found"})
        }

        req.vendorId = vendor._id

        next()

    } catch (error) {
        console.error("Error verifying token:", error);
        res.status(500).json({ message: "Server error." });
    }
};

module.exports = verifyToken;
