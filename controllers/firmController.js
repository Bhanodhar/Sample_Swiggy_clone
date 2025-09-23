const Vendor = require('../models/Vendor');
const Firm = require('../models/Firm');
const Product = require('../models/Product'); // You need this for deleting products
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Save uploaded files in 'uploads' folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Add a new firm linked to a vendor
const addFirm = async (req, res) => {
    try {
        const { firmname, area, category, region, offer } = req.body;
        const image = req.file ? req.file.filename : undefined;
        const vendorId = req.vendorId;

        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found." });
        }

        const newFirm = new Firm({
            firmname,
            area,
            category,
            region,
            offer,
            image,
            vendor: vendor._id
        });

        const savedFirm = await newFirm.save();

        vendor.firm = [savedFirm._id]; 
        const firmId = savedFirm._id
        const vendorFirmName = savedFirm.firmname

        await vendor.save();

        res.status(201).json({ message: "Firm added successfully.", firmId, vendorFirmName  });

    } catch (error) {
        console.error("Error in adding firm:", error);
        res.status(500).json({ message: "Server error." });
    }
};

// Delete a firm by ID
const deleteFirm = async (req, res) => {
    try {
        const firmId = req.params.firmId;
        const firm = await Firm.findById(firmId);
        if (!firm) {
            return res.status(404).json({ message: "Firm not found." });
        }

        const vendor = await Vendor.findById(firm.vendor);
        if (vendor && vendor.firm && vendor.firm.toString() === firmId) {
            vendor.firm = undefined;
            await vendor.save();
        }

        await Product.deleteMany({ firm: firmId });

        await Firm.findByIdAndDelete(firmId);

        res.status(200).json({ message: "Firm and associated products deleted successfully." });
    } catch (error) {
        console.error("Error deleting firm:", error);
        res.status(500).json({ message: "Server error." });
    }
};

module.exports = {
    upload,
    addFirm,
    deleteFirm
};
