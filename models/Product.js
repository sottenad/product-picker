const mongoose = require('mongoose');
const Remote = require('./Remote');

var schemaOptions = {
    toJSON: {
        virtuals: true
    }
};

const productSchema = new mongoose.Schema({
    model: String,
    make: String,
    keyType: String,
    startYear: Number,
    endYear: Number,
    rsType: String,
    activeRemotesFobs: String,
    partNumber: String,
    cost: String
}, schemaOptions);

// Foreign keys definitions

productSchema.virtual('remote', {
    ref: 'Remote',
    localField: 'activeRemotesFobs',
    foreignField: 'key',
    justOne: true // for many-to-1 relationships
  });
  


const Product = mongoose.model('Product', productSchema);
module.exports = Product;