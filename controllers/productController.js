const Product = require('../models/Product');
const Firm = require('../models/Firm');
const path = require('path');


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

// Add a new product
const addProduct = async (req, res) => {
    try {
        const { productname, price, category, bestSeller, description } = req.body;
        
        const image = req.file?req.file.filename : undefined


        // Check if all required fields are provided
        if (!productname || !price || !category) {
            return res.status(400).json({ message: "Please provide all required fields." });
        }

        // Check if the firm exists
        const firmId = req.params.firmId
        const firm = await Firm.findById(firmId);
        if (!firm) {
            return res.status(404).json({ message: "Firm not found." });
        }

        // Create new product instance
        const newProduct = new Product({
            productname,
            price,
            category,
            image,
            bestSeller,
            description,
            firm: firm._id
        });

        // Save the product to the database
        const savedProduct = await newProduct.save();

        // Push the product reference into the firm's products array
        // if (!firm.products) {
        //     firm.products = []; // initialize if it doesn't exist
        // }
        firm.products.push(savedProduct);
        await firm.save();

        res.status(201).json({ message: "Product added successfully.", product: savedProduct });

    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ message: "Server error." });
    }
};



const getProductsByFirm = async (req, res) => {
    try {
        const firmId = req.params.firmId;

        // Check if firm exists
        const firm = await Firm.findById(firmId);
        if (!firm) {
            return res.status(404).json({ message: "Firm not found." });
        }

        // Find all products linked to this firm
        const restaurantsName = firm.firmname;
        const products = await Product.find({ firm: firmId });

        res.status(200).json({ restaurantsName, firm: firm.name, products: products });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Server error." });
    }
};



// Delete a product by ID
const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.productId;

        // Find the product
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        // Remove the product reference from the associated firm
        const firm = await Firm.findById(product.firm);
        if (firm) {
            firm.products = firm.products.filter(p => p.toString() !== productId);
            await firm.save();
        }

        // Delete the product
        await Product.findByIdAndDelete(productId);

        res.status(200).json({ message: "Product deleted successfully." });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Server error." });
    }
};



module.exports = { addProduct: [upload.single('image'),addProduct], getProductsByFirm, deleteProduct };
