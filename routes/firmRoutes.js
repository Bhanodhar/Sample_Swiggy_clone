const express = require('express');

const firmController = require('../controllers/firmController');
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();

// Route to add firm with image upload and token verification
router.post('/add-firm', verifyToken,firmController.addFirm);
// router.post('/add-firm', verifyToken, firmController.upload.single('image'), firmController.addFirm);

    
// Route to delete a firm by ID
router.delete('/delete-firm/:firmId', firmController.deleteFirm);


// Route to serve images from the uploads folder
router.get('/uploads/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    res.headersSent('Content-Type','image/jpeg');
    const imagePath = path.join(__dirname, '../uploads', imageName);

    res.sendFile(imagePath, err => {
        if (err) {
            console.error("Error sending image:", err);
            res.status(404).json({ message: "Image not found." });
        }
    });
});




module.exports = router;
