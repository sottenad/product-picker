const mongoose = require('mongoose');
const Feature = require('../models/Feature');

/**
 * GET /
 * Product page.
 */

exports.index = (req, res) => {
    res.render('features', {
        title: 'Features'
    });
};

