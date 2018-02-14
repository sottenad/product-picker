const mongoose = require('mongoose');
const Remote = require('../models/Remote');

/**
 * GET /
 * Product page.
 */

exports.index = (req, res) => {
    Remote.find({}).exec(function (err, data) {
        if (!err) {
            res.render('remotes', {
                title: 'Remote',
                data: data
            })
        }
    })
};

exports.new = (req, res) => {
    res.render('remotes/new', {
        title: 'Remote',
        csrf: res.locals._csrf
    })
};

exports.create = (req, res) => {
    console.log(req.body);
    var r = new Remote({
        name: req.body.name,
        key: req.body.key
    })
    r.save(function (err, results) {
        if (!err) {
            res.json({results})
        }else{
            res.err(err);
        }
    })
};

exports.edit = (req, res) => {
    Remote.findOne({_id: req.params.remote_id}, function(err, data){
        console.log(data)
        res.render('remotes/edit',{
            remote: data,
            csrf: res.locals._csrf
        })
    })
};

exports.update = (req, res) => {
    Remote.findOneAndUpdate({_id: req.body._id}, {$set:{name:req.body.name, key:req.body.key}}, {new: true}, function(err, doc){
        if(err){
            console.log("Something wrong when updating data!");
        }
        
        req.flash('info', { msg: 'Successfully Updated.' });
        res.redirect('/remotes')
    });
};


