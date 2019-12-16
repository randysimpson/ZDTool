'use strict';
var mongoose = require('mongoose'),
  Organization = mongoose.model('Organization');

exports.getAll = function() {
    return new Promise(function(resolve, reject) {
        Organization.find({}, function(err, result) {
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
  var newOrganization = new Organization(req.body);
  newOrganization.save(function(err, organization) {
    if(err)
      return res.send(err);

    res.json(organization);
  });
};

exports.select = function(req, res) {
  Organization.findById(req.params.id, function(err, organization) {
    if(err)
      return res.send(err);

    res.json(organization);
  });
};

exports.update = function(req, res) {
  Organization.findOneAndUpdate({ id: req.params.id}, req.body, {new: true}, function(err, organization) {
    if(err)
      return res.send(err);

    res.json(organization);
  });
};

exports.remove = function(req, res) {
  Organization.remove({ id: req.params.id}, function(err, organization) {
    if(err)
      return res.send(err);
  
    res.json({ message: 'Organization deleted'});
  });
};