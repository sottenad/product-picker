const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    model: String,
    make: String,
    keyType: String,
    startYear: Number,
    endYear: Number,
    rsType: String,
    activeRemotesFobs: String,
    partNumber: String,
    cost: Number
})
const Product = mongoose.model('Product', productSchema);
module.exports = Product;