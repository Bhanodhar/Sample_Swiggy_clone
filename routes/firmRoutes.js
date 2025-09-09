const express = require('express');
const path = require('path');
const { upload, addFirm, deleteFirm } = require('../controllers/firmController');
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();

// Route to add a firm with image upload and token verification
router.post('/add-firm', verifyToken, upload.single('image'), addFirm);

// Route to delete a firm by ID
router.delete('/delete-firm/:firmId', deleteFirm);

// Route to serve images from the uploads folder
router.get('/uploads/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    const imagePath = path.join(__dirname, '../uploads', imageName);
    res.set('Content-Type', 'image/jpeg');
    res.sendFile(imagePath, err => {
        if (err) {
            console.error("Error sending image:", err);
            res.status(404).json({ message: "Image not found." });
        }
    });
});

module.exports = router;
