'use strict';
var mongoose = require('mongoose'),
    Ticket = mongoose.model('Ticket'),
    Organization = require('./organization'),
    Engineer = require('./engineer'),
    ZDUser = require('./zduser'),
    Sfdc = require('./sfdc'),
    TicketHelp = require('./ticketHelp'),
    wfQueue = require('../../controller/wfQueue'),
    srStats = require('../../controller/srStats');

exports.getByID = function(ids) {
    return new Promise(function(resolve, reject) {
        if(!ids)
            reject("Not correct parameter");
        else {
            Ticket.find({
                id: {
                    "$in" : ids
                }
            }).exec(function(err, result) {
                if(err)
                    reject(err);

                loadDetails(result).then(function(tickets) {
                    resolve(tickets);
                }).catch(function(err) {
                    reject(err);
                });
            });
        }
    });
}

function loadDependencies(userIDList, ticketIDs) {
  //console.log(ticketIDs);
    return new Promise(function(resolve, reject) {
        var promises = [];
        promises.push(Organization.getAll());
        promises.push(ZDUser.getByIDList(userIDList));
        promises.push(Engineer.getAll());
        promises.push(TicketHelp.getAll());
        promises.push(Sfdc.getByTicketIDList(ticketIDs));

        Promise.all(promises).then(function(results) {
            resolve({
                organizations: results[0],
                personList: results[1],
                engineerList: results[2],
                ticketHelp: results[3],
                sfdcList: results[4]
            });
        }).catch(function(err) {
          console.log({
            status: false,
            err
          })
            reject(err);
        });
    });
}

function loadDetails(tickets) {
    return new Promise(function(resolve, reject) {
        var userIDs = [];
        let ticketIDs = [];
        for(var i = 0; i < tickets.length; i++) {
            //var ticket = tickets[i].toObject();
            if(!userIDs.includes(tickets[i].requester_id))
                userIDs.push(tickets[i].requester_id);
            if(!userIDs.includes(tickets[i].assignee_id))
                userIDs.push(tickets[i].assignee_id);
            ticketIDs.push(tickets[i]._id);
        }

        loadDependencies(userIDs, ticketIDs).then(function(result) {
            var rtnTickets = [];
            for(var i = 0; i < tickets.length; i++) {
                var ticket = tickets[i].toObject();
                var currentID = result.organizations.filter(organization => (organization.id == ticket.organization_id));
                if(currentID.length == 1) {
                    ticket.organization = currentID[0];
                }
                currentID = result.personList.filter(requestor => (requestor.id == ticket.requester_id));
                if(currentID.length == 1) {
                    ticket.requestor = currentID[0];
                }
                currentID = result.engineerList.filter(engineer => (engineer.id == ticket.assignee_id));
                if(currentID.length == 1) {
                    ticket.engineer = currentID[0];
                }
                currentID = result.ticketHelp.filter(ticketHelp => (ticketHelp.ticket_id == ticket.id));
                if(currentID.length == 1) {
                    ticket.help = currentID[0];
                } else {
                    ticket.help = {
                        ticket_id: ticket.id,
                        csTeam: false,
                        gtlHelp: false
                    }
                }
                currentID = result.sfdcList.filter(sfdc => (sfdc.ticketID.equals(ticket._id)));
                if(currentID.length == 1) {
                    ticket.sfdc = currentID[0];
                }
                rtnTickets.push(ticket);
            }
            resolve(rtnTickets);
        }).catch(function(err) {
            reject(err);
        });
    });
}

exports.count = function(req, res) {
    var searchBegin = req.query.begin;
    var searchEnd = req.query.end;
    var organization = req.query.organization;
    var criteria = { };

    if(organization) {
        /*Organization.getAll().then((orgs) => {
            var resultOrg = orgs.filter(org => org.name == organization);
            console.log(resultOrg);
        })*/
        //criteria["organization_id"] = organization;
        criteria["organization_id"] = 47963066;
        criteria["solved"] = { $lt: new Date() }
    }
    if(searchBegin) {
        if(searchEnd) {
            criteria = {
                    '$or': [ {
                        'created' : {
                            $gte: new Date(searchBegin),
                            $lt: new Date(searchEnd)
                        }
                    }, {
                        'solved' : {
                            $gte: new Date(searchBegin),
                            $lt: new Date(searchEnd)
                        }
                    } ]
                };
        } else {
            criteria.created = {
                $gte: new Date(searchBegin)
            }
        }
    }
    console.log(criteria);
    Ticket.find(criteria).count().exec(function(err, result) {
        console.log(result);
        if(err)
            return res.send(err);

        res.json(result);
    });
}

exports.list = function(req, res) {
    var ids = req.params.ids;
    if(ids) {
        var idList = ids.split(",");
        exports.getByID(idList).then(function(tickets) {
            if(tickets.length == 0)
                res.status(404).send({ message: "Ticket not found." });
            else if(tickets.length == 1)
                res.json(tickets[0]);
            else
                res.json(tickets);
        }).catch(function(err) {
            return res.send(err);
        });
    } else {
        var searchBegin = req.query.begin;
        var searchEnd = req.query.end;
        var limit = req.query.limit;
        var sort = req.query.sort;
        var startIndex = req.query.startIndex;
        var criteria = req.query.criteria;
        //console.log(criteria);
        if(!criteria)
            criteria = {};
        else
            criteria = Function('"use strict";return (' + criteria + ')')();
        if(searchBegin) {
            if(searchEnd) {
                criteria = {
                    '$or': [ {
                        'created' : {
                            $gte: new Date(searchBegin),
                            $lt: new Date(searchEnd)
                        }
                    }, {
                        'solved' : {
                            $gte: new Date(searchBegin),
                            $lt: new Date(searchEnd)
                        }
                    } ]
                };
            } else {
                criteria.created = {
                    $gte: new Date(searchBegin)
                }
            }
        }
        if(!limit)
            limit = 150;
        else
            limit = parseInt(limit);
        if(!sort)
            sort = { id: 1 };
        else {
            console.log(sort);
            sort = Function('"use strict";return (' + sort + ')')();
        }
        if(!startIndex)
            startIndex = 0;
        else
            startIndex = parseInt(startIndex);
        console.log({
            criteria: criteria,
            sort: sort
        });
      Ticket.find(criteria).limit(limit).skip(startIndex).sort(sort).exec(function(err, result) {
        if(err)
          return res.status(500).send(err);

        loadDetails(result).then(function(tickets) {
            res.json(tickets);
        }).catch(function(err) {
            return res.send(err);
        });
      });
    }
};

exports.listIDs = function(req, res) {
  Ticket.find({}, function(err, result) {
    if(err)
      return res.send(err);

    var rtnList = [];
    for(var i = 0; i < result.length; i++) {
        rtnList.push({
            id: result[i].id
        });
    }
    res.json(rtnList);
  });
};

exports.create = function(req, res) {
    var newTicket = new Ticket(req.body);
    newTicket.save(function(err, ticket) {
        if(err)
            return res.send(err);

        res.json(ticket);
        //save metric to cs.
        wfQueue.addTicket(ticket.id);

        setTimeout(function() {
            srStats.post(ticket.id).then().catch((err) => console.log(err));
        }, 2000);
    });
};

exports.select = function(req, res) {
    exports.getByID([req.params.id]).then(function(tickets) {
        if(tickets.length == 0)
            res.status(404).send({ message: "Ticket not found." });
        else if(tickets.length == 1)
            res.json(tickets[0]);
        else
            res.json(tickets);
    }).catch(function(err) {
        return res.send(err);
    });
};

exports.update = function(req, res) {
    //console.log(req.body);
    /*console.log({
        id: req.params.id,
        body: req.body
    });*/
    Ticket.findOneAndUpdate({ id: req.params.id}, req.body, {new: true}, function(err, ticket) {
        if(err)
            return res.send(err);

        res.json(ticket);
        //save metric to cs.
        wfQueue.addTicket(ticket.id);

        setTimeout(function() {
            srStats.put(ticket.id).then().catch((err) => console.log(err));
        }, 2000);
    });
};

exports.remove = function(req, res) {
  Ticket.remove({ id: req.params.id}, function(err, ticket) {
    if(err)
      return res.send(err);

    res.json({ message: 'Ticket deleted'});
  });
};
