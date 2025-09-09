const express = require('express');

const productController = require('../controllers/productController');

const router = express.Router();

// Route to add a product (with token verification)
router.post('/add-product/:firmId', productController.addProduct);


// Route to get products by firm ID
router.get('/:firmId/products', productController.getProductsByFirm);

// Delete product by ID
router.delete('/delete-product/:productId', productController.deleteProduct);


// Route to serve images from the uploads folder
router.get('/uploads/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    res.set('Content-Type', 'image/jpeg');
    const imagePath = path.join(__dirname, '../uploads', imageName);

    res.sendFile(imagePath, err => {
        if (err) {
            console.error("Error sending image:", err);
            res.status(404).json({ message: "Image not found." });
        }
    });
});




module.exports = router;
