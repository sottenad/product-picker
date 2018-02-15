const mongoose = require('mongoose');
const Product = require('../models/Product');

/**
 * GET /
 * Product page.
 */

exports.index = (req, res) => {
    res.render('products', {
        title: 'Products'
    });
};

exports.all = (req, res) => {
    Product.find({}, function(err, products){
        res.json(products)
    })
};



exports.findDistinct = (req, res) => {
    if(req.params.column){
        Product.find().distinct(req.params.column, function(err, values){
            res.json(values)
        })
    }else{
        res.json({'err':'Please include a mongoose - compatible object to find with'});
    }
};
exports.find = (req, res) => {
    if(req.body){
        const q =  req.body.query;
        const limit = req.body.limit >= 500 ? 500 : req.body.limit;
        const sort = req.body.sort ? req.body.sort : {};
        console.log(q);
        const before = new Date();
        if(req.body.distinct){
            Product.find(q).distinct(req.body.distinct).exec(function(err, items){
                const after = new Date();
                const ticks = after - before;
                res.json({ticks: ticks, results:items})
            })
        }else{
            Product.find(q).limit(limit).exec(function(err, items){
                const after = new Date();
                const ticks = after - before;
                res.json({ticks: ticks, results:items})
            })
        }
    }else{
        res.json({'err':'Please include a mongoose - compatible object to find with'});
    }
};

exports.findItems = (req, res) => {
    if(req.body){
        const q =  req.body.query;
        const limit = req.body.limit >= 500 ? 500 : req.body.limit;
        const sort = req.body.sort ? req.body.sort : {};
        const populate = req.body.populate || ""
        console.log(q);
        const before = new Date();
        Product.find(q).populate(populate).limit(limit).exec(function(err, items){
            const after = new Date();
            const ticks = after - before;
            res.json({ticks: ticks, results:items})
        })
    }
}

exports.findYears = (req, res) => {
    const year = req.body.year;
    const q = req.body.query;
    const before = new Date()

    Product.aggregate([
        {"$match" : {
            make:q.make,
            model:q.model
            }
        },
        {"$group":{
                _id: {startYear: "$startYear", endYear: "$endYear", make:"$make", model:"$model", keyType:"$keyType"}
            }
        }  
    ]).exec(function(err, items){
    
        const after = new Date();
        const ticks = after - before;
        res.json({ticks: ticks, results:items});
    });
};