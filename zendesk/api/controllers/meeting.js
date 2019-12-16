'use strict';
var mongoose = require('mongoose'),
    Ticket = require('./ticket'),
    Meeting = require('./meeting'),
    MeetingDB = mongoose.model('Meeting');

function loadDetails(meetings) {
    var meetingList = [];
    for(var k = 0; k < meetings.length; k++) {
        meetingList.push(meetings[k].toObject());
    }
    console.log(meetingList);
    return new Promise(function(resolve, reject) {
        //get the list of tickets.
        var ticketList = [];
        for(var i = 0; i < meetingList.length; i++) {
            if(meetingList[i].ticketDiscussion && meetingList[i].ticketDiscussion[0]) {
                for(var j = 0; j < meetingList[i].ticketDiscussion.length; j++) {
                    ticketList.push(meetingList[i].ticketDiscussion[j].ticket.id);
                }
            } else {
                meetingList[i].ticketDiscussion = [];
            }
        }
        if(ticketList.length > 0) {
            Ticket.getByID(ticketList).then(function(tickets) {
                for(var i = 0; i < meetingList.length; i++) {
                    for(var j = 0; j < meetingList[i].ticketDiscussion.length; j++) {
                        var ticket = tickets.filter(t => (t.id == meetingList[i].ticketDiscussion[j].ticket.id));
                        meetingList[i].ticketDiscussion[j].ticket = ticket[0];
                    }
                }
                resolve(meetingList);
            }).catch(function(err) {
                reject(err);
            });
        } else {
            resolve(meetingList);
        }
    });
}

function formatSave(details) {
    //console.log(details);
    return new Promise(function(resolve, reject) {
        if(!details)
            reject("No data");
        else {
            //only save ticket id's
            for(var i = 0; i < details.ticketDiscussion.length; i++) {
                var ticketID = details.ticketDiscussion[i].ticket.id;
                delete details.ticketDiscussion[i].ticket;
                details.ticketDiscussion[i].ticket = {
                    id: ticketID
                };
            }
            if(!details.created)
                details.created = new Date();
            details.updated = new Date();
            resolve(details);
        }
    });
}

exports.list = function(req, res) {
    var notInConfluence = req.query.NotInConfluence;
    var sort = req.query.sort;
    var begin = req.query.begin;
    var end = req.query.end;
    var search = {};
    if(notInConfluence) {
        search.addedConfluence = {
            $exists: false
        };
    } else {
      var sortBy = {};
      if(sort == 'created desc') {
          sortBy.meetingDate = -1
      } else if(sort == 'created') {
          sortBy.meetingDate = 1
      }
    }
    var limit = 100;
    if(begin) {
        begin -= 1;
        if(end) {
            limit = end - begin;
        }
    } else
        begin = 0;
  MeetingDB.find(search).sort(sortBy).skip(begin).limit(limit).exec(function(err, result) {
    if(err)
      return res.send(err);

    loadDetails(result).then(function(meeting) {
        res.json(meeting);
    }).catch(function(err) {
        return res.send(err);
    });
  });
};

exports.create = function(req, res) {
    formatSave(req.body).then(function(result) {
        var newMeeting = new MeetingDB(result);
        newMeeting.save(function(err, meeting) {
            if(err)
              return res.send(err);

            loadDetails([meeting]).then(function(rtnResult) {
                res.json(rtnResult[0]);
            }).catch(function(err) {
                console.log(err);
                res.status(500).send({ message: "Meeting saved but issue may have caused inconsistancies." });
            });
        });
    }).catch(function(err) {
        console.log(err);
        res.status(404).send({ message: "Meeting not in correct format." });
    });
};

exports.select = function(req, res) {
    MeetingDB.find({ _id: req.params.id }, function(err, result) {
        if(err)
            return res.send(err);

        loadDetails(result).then(function(meeting) {
            if(meeting.length == 0)
                res.status(404).send({ message: "Meeting not found." });
            else if(meeting.length == 1)
                res.json(meeting[0]);
            else
                res.json(meeting);
        }).catch(function(err) {
            return res.send(err);
        });
    });
};

exports.update = function(req, res) {
    formatSave(req.body).then(function(result) {
        MeetingDB.findOneAndUpdate({ _id: req.params.id}, result, {new: true}, function(err, meeting) {
            if(err)
                return res.send(err);

            res.json(meeting);
        });
    }).catch(function(err) {
        res.status(404).send({ message: "Meeting not in correct format." });
    });
};

exports.remove = function(req, res) {
  MeetingDB.remove({ _id: req.params.id}, function(err, meeting) {
    if(err)
      return res.send(err);
  
    res.json({ message: 'Meeting deleted'});
  });
};

exports.count = function(req, res) {
    MeetingDB.count({}, function(err, count) {
        if(err)
            return res.send(err);
        
        res.json({ count: count});
    });
};