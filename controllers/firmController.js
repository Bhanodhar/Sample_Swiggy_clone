const Vendor = require('../models/Vendor');
const Firm = require('../models/Firm');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Save uploaded files in 'uploads' folder
    },
    filename: function (req, file, cb) {
        cb(null,Date.now() + path.extname(file.originalname));
    }
});


const upload = multer({ storage: storage });


// Add a new firm linked to a vendor
const addFirm = async (req, res) => {
    try {
        const { firmname, area, category, region, offer } = req.body;

        const image = req.file?req.file.filename : undefined


        const vendorId = req.vendorId; // This should be set by verifyToken middleware

        // Check if vendor exists
        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found." });
        }

        // // Check if file is uploaded
        // if (!req.file) {
        //     return res.status(400).json({ message: "Please upload an image file." });
        // }

        // const image = req.file.path; // Path to the uploaded image

        // Create a new firm
        const newFirm = new Firm({
            firmname,
            area,
            category,
            region,
            offer,
            image,
            vendor: vendor._id
        });

        // Save firm to database
        const savedFirm = await newFirm.save();
        vendor.firm.push(savedFirm)
        await vendor.save()

        // Optionally, link firm to vendor (if needed, uncomment below)
        // vendor.firm = newFirm._id;
        // await vendor.save();

        res.status(201).json({ message: "Firm added successfully.", firm: newFirm });

    } catch (error) {
        console.error("Error in adding firm:", error);
        res.status(500).json({ message: "Server error." });
    }
};



// Delete a firm by ID
const deleteFirm = async (req, res) => {
    try {
        const firmId = req.params.firmId;

        // Find the firm
        const firm = await Firm.findById(firmId);
        if (!firm) {
            return res.status(404).json({ message: "Firm not found." });
        }

        // Remove the firm reference from the associated vendor
        const vendor = await Vendor.findById(firm.vendor);
        if (vendor) {
            if (vendor.firm && vendor.firm.toString() === firmId) {
                vendor.firm = undefined; // Or null depending on your schema
                await vendor.save();
            }
        }

        // Optionally, delete all products associated with this firm
        await Product.deleteMany({ firm: firmId });

        // Delete the firm itself
        await Firm.findByIdAndDelete(firmId);

        res.status(200).json({ message: "Firm and associated products deleted successfully." });
    } catch (error) {
        console.error("Error deleting firm:", error);
        res.status(500).json({ message: "Server error." });
    }
};




module.exports = {
    addFirm:[upload.single('image'), addFirm, deleteFirm]
    // upload // Export multer middleware to use in routes
};