'use strict';
var mongoose = require('mongoose'),
    Corespondence = mongoose.model('Corespondence'),
    ZDUser = require('./zduser'),
    wfQueue = require('../../controller/wfQueue');

function loadDependencies(userIDList) {
    return new Promise(function(resolve, reject) {
        ZDUser.getByIDList(userIDList)
            .then((results) => resolve({personList: results}))
            .catch((err) => reject(err));
    });
}

function loadDetails(items) {
    return new Promise(function(resolve, reject) {
        var userIDs = [];
        for(var i = 0; i < items.length; i++) {
            if(!userIDs.includes(items[i].author_id))
                userIDs.push(items[i].author_id);
        }
        //load the IDs.
        loadDependencies(userIDs).then(function(result) {
            var rtnTickets = [];
            for(var i = 0; i < items.length; i++) {
                var item = items[i].toObject();
                
                var currentID = result.personList.filter(person => (person.id == item.author_id));
                if(currentID.length == 1) {
                    item.author = currentID[0];
                }

                rtnTickets.push(item);
            }
            resolve(rtnTickets);
        }).catch(function(err) {
            reject(err);
        });
    });
}

exports.idList = function(req, res) {
    var ids = req.params.ids;
    if(ids) {
        var idList = ids.split(",");
        Corespondence.find({
            ticket_id: {
                    "$in" : idList
                }
        }).limit(100).sort('ticket_id').exec((err, result) => {
            //console.log(result);
            if(err)
                return res.send(err);
            else {
                //just send id's of the tickets that are here.
                var rtnIDs = [];
                var ticketID = "";
                var item = undefined;
                for(var i = 0; i < result.length; i++) {
                    if(result[i].ticket_id != ticketID) {
                        ticketID = result[i].ticket_id;
                        if(item)
                            rtnIDs.push(item);
                        item = {
                            ticket_id: ticketID,
                            corespondence: [result[i].id]
                        };
                    } else {
                        item.corespondence.push(result[i].id);
                    }
                }
                //push the last item onto the array.
                if(item)
                    rtnIDs.push(item);
                //console.log(rtnIDs);
                res.json(rtnIDs);
            }
        });
    }
}

exports.list = function(req, res) {
    var id = req.params.id;
    if(id) {
        Corespondence.find({ ticket_id: id }).limit(100).sort('created_at desc').exec((err, result) => {
            if(err)
                return res.send(err);
            else {
                loadDetails(result).then(function(items) {
                    res.json(items);
                }).catch(function(err) {
                    return res.send(err);
                });
            }
        });
    } else {
        var skip = req.query.skip;
        if(!skip)
            skip = 0;
        skip = parseInt(skip);
      Corespondence.find({}).skip(skip).limit(100).sort('_id').exec(function(err, result) {
        if(err)
          return res.send(err);

        loadDetails(result).then(function(items) {
            res.json(items);
        }).catch(function(err) {
            return res.send(err);
        });
      });
    }
};

exports.count = function(req, res) {
    Corespondence.find({}).count().exec(function(err, result) {
        if(err)
            return res.send(err);
        
        return res.json(result);
    });
};

exports.create = function(req, res) {
    var newItem = new Corespondence(req.body);
    newItem.save(function(err, item) {
        if(err)
            return res.send(err);

        res.json(item);
        //save metric to cs.
        wfQueue.addCorespondence(item.id);
    });
};

exports.selectOne = function(id) {
    return new Promise((resolve, reject) => {
        Corespondence.find({ id: id }).exec((err, result) => {
            if(err)
                reject(err);
            else if(result.length == 0)
                reject({ message: "Corespondence not found." });
            else
                loadDetails(result).then((item) => {
                    resolve(item[0]);
                }).catch((err) => reject(err));
        });
    });
};

exports.select = function(req, res) {
    exports.selectOne(req.params.id)
        .then((item) => res.json(item))
        .catch((err) => res.send(err));
};

exports.update = function(req, res) {
  Corespondence.findOneAndUpdate({ id: req.params.id}, req.body, {new: true}, function(err, item) {
    if(err)
      return res.send(err);

    res.json(item);
  });
};

exports.remove = function(req, res) {
  Corespondence.remove({ id: req.params.id}, function(err, item) {
    if(err)
      return res.send(err);
  
    res.json({ message: 'Corespondence deleted'});
  });
};

exports.fix = function(req, res) {
    //find orphand/duplicate records.. if any.
    Corespondence.find({}).sort('ticket_id asc').exec((err, result) => {
        if(err) {
            console.log({ error: err });
            res.status(500).json({ error: err });
        } else {
            var ticket_id = undefined;
            for(var i = 0; i < result.length; i++) {
                if(result[i].ticket_id == ticket_id)
                    console.log("dup: " + ticket_id);
                ticket_id = result[i].ticket_id;
            }
            res.json({ fixed: 0 });
        }
    });
};