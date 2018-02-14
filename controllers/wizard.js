const mongoose = require('mongoose');
const Product = require('../models/Product');

/**
 * GET /
 * Product page.
 */

exports.index = (req, res) => {
    res.render('wizard', {
        title: 'Wizard'
    });
};
