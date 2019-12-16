'use strict';
var mongoose = require('mongoose'),
    ZDUser = mongoose.model('ZDUser');

exports.getByIDList = function(ids) {
    return new Promise(function(resolve, reject) {
        if(!ids)
            reject("Not correct parameter");
        else {
            ZDUser.find({
                id: {
                    "$in" : ids
                }
            }).exec(function(err, result) {
                if(err)
                    reject(err);

                resolve(result);
            });
        }
    });
};

exports.getAll = function() {
    return new Promise(function(resolve, reject) {
        ZDUser.find({}, function(err, result) {
            if(err)
                reject(err);
            else
                resolve(result);
        });
    });
};

exports.getItem = function(id) {
    return new Promise((resolve, reject) => {
        ZDUser.find({ id: id }, function(err, zduser) {
            if(err)
                reject(err);

            if(zduser.length == 1)
                resolve(zduser[0]);
            else
                resolve();
        });
    });
};

exports.updateItem = function(item) {
    return new Promise((resolve, reject) => {
        ZDUser.findOneAndUpdate({ id: item.id}, item, {new: true}, function(err, zduser) {
            if(err)
                reject(err);
            else
                resolve(zduser);
        });
    });
};

exports.list = function(req, res) {
    exports.getAll().then(function(result) {
        res.json(result);
    }).catch(function(err) {
        return res.send(err);
    });
};

exports.create = function(req, res) {
    var newItem = new ZDUser(req.body);
    //console.log(newItem);
    //don't allow duplicates!
    ZDUser.find({ id: newItem.id}, function(err, zdusers) {
        if(err) {
            console.log(err);
            return res.send(err);
        }

        //console.log(zdusers);
        
        if(zdusers.length == 0) {
            newItem.save(function(err, zduser) {
                if(err)
                    return res.send(err);

                res.json(zduser);
            });
        } else {
            res.json(zdusers[0]);
        }
    });
};

exports.select = function(req, res) {
    exports.getItem(req.params.id).then((result) => {
        if(result)
            return res.json(result);
        else
            res.status(404).send("item not found");
    }).catch((err) => {
        return res.send(err);
    });
};

exports.update = function(req, res) {
    exports.updateItem(req.body)
        .then((result) => res.json(result))
        .catch((err) => res.status(500).send(err));
};

exports.remove = function(req, res) {
  ZDUser.remove({ id: req.params.id}, function(err, zduser) {
    if(err)
      return res.send(err);
  
    res.json({ message: 'ZDUser deleted'});
  });
};