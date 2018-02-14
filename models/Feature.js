const mongoose = require('mongoose');
const featureSchema = new mongoose.Schema({
    id: String,
    name: String
})
const Feature = mongoose.model('Feature', featureSchema);
module.exports = Feature;