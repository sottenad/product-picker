const mongoose = require('mongoose');
const remoteSchema = new mongoose.Schema({
    key: String,
    name: String
})
const Remote = mongoose.model('Remote', remoteSchema);
module.exports = Remote;