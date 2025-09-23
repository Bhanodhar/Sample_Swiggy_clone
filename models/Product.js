const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productname: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    category: {
        type: [
            {
                type: String,
                enum: ['veg', 'non-veg']
            }
        ] // Multiple values like ["veg", "non-veg"]
    },
    image: {
        type: String
    },
    bestSeller: {
        type: Boolean,
    },
    description: {
        type: String
    },
    firm: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Firm', // Reference to the Firm model
    }]
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
