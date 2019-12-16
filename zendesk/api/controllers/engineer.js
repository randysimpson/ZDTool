'use strict';
var mongoose = require('mongoose'),
  Engineer = mongoose.model('Engineer'),
  ZDUser = require('./zduser');


function loadDependencies(userIDList) {
    return new Promise(function(resolve, reject) {
        ZDUser.getByIDList(userIDList)
            .then((results) => resolve({personList: results}))
            .catch((err) => reject(err));
    });
};

function loadDetails(items) {
    return new Promise(function(resolve, reject) {
        var userIDs = [];
        for(var i = 0; i < items.length; i++) {
            if(!userIDs.includes(items[i].id))
                userIDs.push(items[i].id);
        }
        //load the IDs.
        loadDependencies(userIDs).then(function(result) {
            var rtnItems = [];
            for(var i = 0; i < items.length; i++) {
                var item = items[i].toObject();
                
                var currentID = result.personList.filter(person => (person.id == item.id));
                if(currentID.length == 1) {
                    //combine objects!
                    item.role = currentID[0].role;
                    item.organization_id = currentID[0].organization_id;
                    item.created_at = currentID[0].created_at;
                    item.email = currentID[0].email;
                    item.url = currentID[0].url;
                    item.name = currentID[0].name;
                }

                rtnItems.push(item);
            }
            resolve(rtnItems);
        }).catch(function(err) {
            reject(err);
        });
    });
};

exports.getAll = function() {
    return new Promise(function(resolve, reject) {
        Engineer.find({}, function(err, result) {
            if(err)
                reject(err);
            else {
                loadDetails(result).then(function(items) {
                    resolve(items);
                }).catch(function(err) {
                    reject(err);
                });
            }
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

//need to handle base fields!
exports.create = function(req, res) {
  var newEngineer = new Engineer(req.body);
  newEngineer.save(function(err, engineer) {
    if(err)
      return res.send(err);

    res.json(engineer);
  });
};

exports.select = function(req, res) {
  Engineer.findById(req.params.id, function(err, engineer) {
    if(err)
      return res.send(err);

    loadDetails([engineer]).then(function(item) {
        res.json(item[0]);
    }).catch(function(err) {
        return res.send(err);
    });
  });
};

exports.update = function(req, res) {
    var newItem = req.body;
    Engineer.findOneAndUpdate({ id: req.params.id}, newItem, {new: true}, function(err, engineer) {
        if(err)
            return res.send(err);

        else {
            //need to handle base fields!
            ZDUser.updateItem(newItem)
                .then((result) => res.json(newItem))
                .catch((err) => res.status(500).send(err));
        }
    });
};


exports.remove = function(req, res) {
  Engineer.remove({ id: req.params.id}, function(err, engineer) {
    if(err)
      return res.send(err);
  
    res.json({ message: 'Engineer deleted'});
  });
};