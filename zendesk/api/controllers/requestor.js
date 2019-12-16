'use strict';
var mongoose = require('mongoose'),
  Requestor = mongoose.model('Requestor');

exports.getAll = function() {
    return new Promise(function(resolve, reject) {
        Requestor.find({}, function(err, result) {
            if(err)
                reject(err);
            else
                resolve(result);
        });
    });
}

exports.list = function(req, res) {
    exports.getAll().then(function(result) {
        res.json(result);
    }).catch(function(err) {
        return res.send(err);
    });
};

exports.create = function(req, res) {
  var newRequestor = new Requestor(req.body);
  newRequestor.save(function(err, requestor) {
    if(err)
      return res.send(err);

    res.json(requestor);
  });
};

exports.select = function(req, res) {
  Requestor.findById(req.params.id, function(err, requestor) {
    if(err)
      return res.send(err);

    res.json(requestor);
  });
};

exports.update = function(req, res) {
  Requestor.findOneAndUpdate({ id: req.params.id}, req.body, {new: true}, function(err, requestor) {
    if(err)
      return res.send(err);

    res.json(requestor);
  });
};

exports.remove = function(req, res) {
  Requestor.remove({ id: req.params.id}, function(err, requestor) {
    if(err)
      return res.send(err);
  
    res.json({ message: 'Requestor deleted'});
  });
};