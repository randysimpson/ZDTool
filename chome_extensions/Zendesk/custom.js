const k8masterZendeskApp = 'https://10.21.96.218:32222/api/v1/';
const zdHostname = "<your hostname>"  //can get this from url it is in format of: <your hostname>.zendesk.com
const jiraBearerToken = "123"

function ajaxLoad(filename) {
    return new Promise(function(resolve, reject) {
        var url = k8masterZendeskApp + filename;
        $.ajax({
            context: this,
            url: url,
            method: "GET",
            contentType: "application/json; charset=utf-8",
        }).done(function(data) {
            resolve(data);
        }).fail(function(error) {
            reject(error);
        });
    });
};

function ajaxSave(name, data) {
    return new Promise(function(resolve, reject) {
        var url = k8masterZendeskApp + name;
        $.ajax({
            context: this,
            url: url,
            method: "POST",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(data)
        }).done(function(data) {
            resolve(data);
        }).fail(function(error) {
            reject(error);
        });
    });
};

function ajaxPut(name, data) {
    return new Promise(function(resolve, reject) {
        var url = k8masterZendeskApp + name;
        $.ajax({
            context: this,
            url: url,
            type: "PUT",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(data)
        }).done(function(data) {
            resolve(data);
        }).fail(function(error) {
            reject(error);
        });
    });
};

function importZDUser(id) {
    return new Promise((resolve, reject) => {
        $.getJSON("https://" + zdHostname + ".zendesk.com/api/v2/users/" + id, (data) => {
            //save this in zsuser
            ajaxSave("zduser", data.user).then((result) => resolve(result)).catch((err) => reject(err));
        });
    });
}

function getZDUser(id) {
    return new Promise((resolve, reject) => {
        ajaxLoad("zduser/" + id).then((result) => resolve(result)).catch((err) => reject(err));
    });
}

function verifyAddUser(userID) {
    return new Promise((resolve, reject) => {
        getZDUser(userID).then((result) => {
            if(!result) {
                importZDUser(userID).then((result) => {
                    resolve(result);
                }).catch((err) => reject(err));
            } else
                resolve(result);
        }).catch((err) => {
            if(err.status == 404)
                importZDUser(userID).then((result) => {
                    resolve(result);
                }).catch((err) => reject(err));
            else
                reject(err)
        });
    });
}

function importRequestors(requestors) {
    return new Promise(function(resolve, reject) {
        if(requestors.length > 0) {
            var promises = [];
            for(var i = 0; i < requestors.length; i++) {
                promises.push(verifyAddUser(requestors[i].id));
            }
            Promise.all(promises).then(function() {
                resolve();
            }, function(err) {
                reject(err);
            });
        } else {
            reject("Not correct parameters");
        }
    });
}

function importOrganizations(organizations) {
    return new Promise(function(resolve, reject) {
        if(organizations.length > 0) {
            ajaxLoad("organizations").then(function(result) {
                var promises = [];
                var currentList = result;
                for(i = 0; i < organizations.length; i++) {
                    var currentID = currentList.filter(requestor => (requestor.id == organizations[i].id));
                    if(currentID.length == 0) {
                        //need to add it.
                        promises.push(ajaxSave("organizations", organizations[i]));
                    }
                }
                Promise.all(promises).then(function() {
                    resolve();
                }, function(err) {
                    reject(err);
                });
            }).catch(function(err) {
                reject(err);
            });
        } else {
            reject("Not correct parameters");
        }
    });
}

function importTicketDetails(ticket) {
    return new Promise(function(resolve, reject) {
        $.getJSON("https://" + zdHostname + ".zendesk.com/api/v2/tickets/" + ticket.id, (details) => {
                ticket.raw_subject = details.ticket.raw_subject;
                ticket.tags = details.ticket.tags;
                resolve(ticket);
            });
    });
}

function getJiraInfo(ticket) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: 'https://jiraplugin.zendesk.com/integrations/jira/account/' + zdHostname + '/links/for_ticket?ticket_id=' + ticket.id,
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + jiraBearerToken);
            },
            method: 'GET',
            success: function(data) {
                //console.log(data);
                ticket.jiria_links = [];
                for(var i = 0; i < data.links.length; i++) {
                    ticket.jiria_links.push({
                        id: data.links[i].id,
                        issue_id: data.links[i].issue_id,
                        issue_key: data.links[i].issue_key
                    });
                }
                //get the rest of the ticket details!
                importTicketDetails(ticket)
                    .then((details) => resolve(details))
                    .catch((err) => reject(err));
            },
            error: function(jqXHR, status, err) {
                console.log({
                    jqXHR: jqXHR,
                    status: status,
                    err: err
                });
                reject(err);
            }
        });
    });
};

function updateTickets(ticketList) {
    return new Promise(function(resolve, reject) {
        var getJiraPromises = [];
        var promises = [];
        var idList = [];
        for(var i = 0; i < ticketList.length; i++) {
            idList.push(ticketList[i].id);
        }
        var ids = idList.join(",");
        ajaxLoad("tickets/" + ids)
            .then((result) => {
                if(idList.length == 1)
                    result = [result];
                var updateCor = [];
                for(var j = 0; j < result.length; j++) {
                    var newInfo = ticketList.filter(ticket => (ticket.id == result[j].id));
                    if(newInfo.length == 1) {
                        var d1 = new Date(newInfo[0].updated);
                        var d2 = new Date(result[j].updated);
                        if(d1.getTime() !== d2.getTime()) {
                            /*console.log({
                                a: d1,
                                b: d2
                            });*/
                            getJiraPromises.push(getJiraInfo(newInfo[0]));
                            /*getJiraInfo(newInfo[0])
                                .then((updateTicket) => {
                                    promises.push(ajaxPut("ticket/" + updateTicket.id, updateTicket));
                                    updateCor.push(updateTicket.id);
                                })
                                .catch((err) => reject(err));*/
                            //update corespondence
                        }
                    }
                    //updateCor.push(newInfo[0].id);
                }
                Promise.all(getJiraPromises)
                    .then((results) => {
                        for(var k = 0; k < results.length; k++) {
                            promises.push(ajaxPut("ticket/" + results[k].id, results[k]));
                            updateCor.push(results[k].id);
                        }
                        
                        if( updateCor.length > 0) {
                            updateCorespondence(updateCor).then((result) => {
                                promises = promises.concat(result);
                                resolve(promises);
                            }).catch((err) => reject(err));
                        } else {
                            console.log("nothing to update");
                            resolve(promises);
                        }
                    })
                    .catch((err) => reject(err));
            })
            .catch((err) => reject(err));
    });
}

function updateCorespondence(idList) {
    return new Promise(function(resolve, reject) {
        var promises = [];
        var ids = idList.join(",");
        ajaxLoad("corespondence/ticketids/" + ids)
            .then((result) => {
                for(var j = 0; j < idList.length; j++) {
                    var existingItems = result.filter(item => item.ticket_id == idList[j]);
                    var existingCorrespondenceIDs = []
                    for(var i = 0; i < existingItems.length; i++) {
                        existingCorrespondenceIDs.push(existingItems[i].id);
                    }

                    //insert new
                    promises.push(importCorespondence(idList[j], existingCorrespondenceIDs));
                }
                Promise.all(promises)
                    .then(() => resolve())
                    .catch((err) => reject(err));
            })
            .catch((err) => reject(err));
    });
}

function insertUserCorespondence(corespondence) {
    return new Promise((resolve, reject) => {
        //console.log("verify user " + corespondence.author_id);
        verifyAddUser(corespondence.author_id).then((result) => {
            //console.log("save corresponence " + corespondence.id);
            ajaxSave("corespondence", corespondence)
                .then((result) => resolve(result))
                .catch((err) => reject(err));
        }).catch((err) => {
            //404, means it was not found!
            /*console.log({
                name: "error",
                err: err
            });*/
            reject(err)
        });
    });
}

function importCorespondence(id, idList) {
    return new Promise((resolve, reject) => {
        $.getJSON("https://" + zdHostname + ".zendesk.com/api/lotus/tickets/" + id + "/conversations.json?include=users&sort_order=desc", function(data) {
            var list = data.conversations;
            var promises = [];
            for(var i = 0; i < list.length; i++) {
                if(!idList.includes(list[i].id)) {
                    list[i].ticket_id = id;
                    
                    promises.push(insertUserCorespondence(list[i]));
                    /*insertUserCorespondence(list[i]).then((resultPromise) => {
                        promises.push(resultPromise);
                    }).catch((err) => {
                        reject(err)
                    });*/
                }
            }
            Promise.all(promises).then((results) => {
                //send back the promises.
                resolve(results);
            }).catch((err) => reject(err));
        });
    });
}

function getJiraSaveImportCorr(ticket) {
    return new Promise(function(resolve, reject) {
        getJiraInfo(ticket)
            .then((newTicket) => {
                ajaxSave("tickets", newTicket)
                    .then((result) => {
                        importCorespondence(newTicket.id, []).then(() => resolve()).catch((err) => reject(err));
                    })
                    .catch((err) => reject(err));
            })
            .catch((err) => reject(err));
    });
}

function importTickets(tickets) {
    return new Promise(function(resolve, reject) {
        if(tickets.length > 0) {
            ajaxLoad("tickets/id").then(function(result) {
                var jiraPromises = [];
                var promises = [];
                var created = 0;
                var existingTicketList = [];
                var currentList = result;
                for(i = 0; i < tickets.length; i++) {
                    var currentID = currentList.filter(ticket => (ticket.id == tickets[i].ticket.id));
                    var ticket = {
                        id: tickets[i].ticket.id,
                        subject: tickets[i].ticket.subject,
                        description: tickets[i].ticket.description,
                        status: tickets[i].ticket.status,
                        type: tickets[i].ticket.type,
                        priority: tickets[i].ticket.priority,
                        url: tickets[i].ticket.url,
                        last_comment: tickets[i].ticket.last_comment,
                        via_id: tickets[i].ticket.via_id,
                        organization_id: tickets[i].organization_id,
                        requester_id: tickets[i].requester_id,
                        created: tickets[i].created,
                        updated: tickets[i].updated,
                        assignee_id: tickets[i].assignee_id,
                        solved: tickets[i].solved
                    };
                    if(currentID.length == 0 && tickets[i].ticket.id != 3747) {
                        //need to add it.
                        created++;
                        jiraPromises.push(getJiraSaveImportCorr(ticket));
                    } else if(currentID.length == 1) {
                        //update it!
                        existingTicketList.push(ticket);
                    }
                }
                Promise.all(jiraPromises)
                    .then()
                    .catch((err) => reject(err));

                //check existing tickets.
                updateTickets(existingTicketList).then((result) => {
                    var updated = result.length;
                    promises = promises.concat(result);
                    //console.log({ updated: updated, result: result });
                    //if(promises.length > 0) {
                        //console.log(updated);
                        Promise.all(promises).then(function() {
                            resolve({
                                created: created,
                                updated: updated
                            });
                        }, function(err) {
                            reject(err);
                        });
                    /*} else
                        console.log("here");
                        resolve({
                            created: 0,
                            updated: 0
                        });*/
                }).catch((err) => console.log(err));
                //promises.push(ajaxPut("ticket/" + ticket.id, ticket));
            }).catch(function(err) {
                reject(err);
            });
        } else {
            reject("Not correct parameters");
        }
    });
}

//get the tickets!
function getTickets(page) {
    return new Promise(function(resolve, reject) {
        $.getJSON("https://" + zdHostname + ".zendesk.com/api/v2/views/37544270/execute.json?per_page=60&page=" + page + "&sort_by=updated&sort_order=desc&group_by=+&include=via_id", function(data) {
            var requestors = data.users;
            var organizations = data.organizations;
            var tickets = data.rows;

            var promises = [];
            promises.push(importRequestors(requestors));
            promises.push(importOrganizations(organizations));
            promises.push(importTickets(tickets));
            
            Promise.all(promises).then(function(results) {
                console.log(results[2]);
                resolve();
            }, function(err) {
                reject(err);
            });
        });
    });
}

var handle = setInterval(function() {
    console.log(new Date());
    getTickets(1).then(function(result) {
        console.log("done");
    }).catch(function(err) {
        console.log(err);
    });
}, 10000 * 60); //every 10 min?


for(let i = 1; i < 19; i++) {
    getTickets(i).then(function(result) {
        console.log("done");
    }).catch(function(err) {
        console.log(err);
    });
}