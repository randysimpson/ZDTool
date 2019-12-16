'use strict';
var mongoose = require('mongoose'),
    Bow = mongoose.model('bow');

exports.list = function(req, res) {
    var skip = req.query.skip;
    if(!skip)
        skip = 0;
    skip = parseInt(skip);
    Bow.find({}).skip(skip).limit(100).sort('_id').exec(function(err, result) {
        if(err)
          return res.send(err);

        res.json(result);
    });
};

exports.count = function(req, res) {
    Bow.find({}).count().exec(function(err, result) {
        if(err)
            return res.send(err);
        
        return res.json(result);
    });
};

exports.create = function(req, res) {
  var newItem = new Bow(req.body);
  newItem.save(function(err, item) {
    if(err)
      return res.send(err);

    res.json(item);
  });
};

exports.select = function(req, res) {
    Bow.find({ id: req.params.id }).exec((err, result) => {
        if(err)
            return res.send(err);
        else if(result.length == 0)
            res.status(404).send({ message: "Bow not found." });
        else
            res.json(result[0]);
    });
};

exports.update = function(req, res) {
  Bow.findOneAndUpdate({ id: req.params.id}, req.body, {new: true}, function(err, item) {
    if(err)
      return res.send(err);

    res.json(item);
  });
};

exports.remove = function(req, res) {
  Bow.remove({ id: req.params.id}, function(err, item) {
    if(err)
      return res.send(err);
  
    res.json({ message: 'Bow deleted'});
  });
};