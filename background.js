"use strict";

var ticketList = [];


chrome.alarms.create("jiraMon", {
    delayInMinutes: 1,
    periodInMinutes: 1
});


chrome.alarms.onAlarm.addListener(function(alarm) {
    if (alarm.name === "jiraMon") {
        var koidsCIT = [
            'S519148', 
            'S511003', 
            'S520108', 
            'S492930', 
            'S389051', 
            'S385334', 
            'S519789', 
            'S385334', 
            'S278379', 
            'S466884', 
            'O53275'
        ];

        // Request the comments page for the current ticket
        $.ajax("https://jira.coke.com/jira/rest/gadget/1.0/issueTable/filter?num=10&tableContext=jira.table.cols.dashboard&addDefault=false&columnNames=issuekey&columnNames=summary&columnNames=lastViewed&enableSorting=true&paging=true&showActions=true&filterId=31627&sortBy=&startIndex=0&_=1569954812196").done(function( data ) {
            var r = new RegExp(/(?:issuekey=.(AEM-\d*))/, 'gm');
            var keys = [];    
            
            // Check if the last comment is from CI&T, if not, include in the list
            checkComments(r, data, koidsCIT, keys);
            
        });

        function checkComments(r, data, koidsCIT, keys){
            var match = r.exec(data.table);
            ticketList = [];
            if(match !== null){
                var ticket = match[1];
                console.log(ticket);
                $.ajax("https://jira.coke.com/jira/browse/"+ticket+"?page=com.atlassian.jira.plugin.system.issuetabpanels:comment-tabpanel&_=1569958096799").done(function( dataComments ) {
                    var regComments = new RegExp(/(?:alt=.*?"(\w\d{5}).*?added)/, 'gm');
                    var matchComments = regComments.exec(dataComments);
                    var lastKOID = "";
                    while(matchComments !== null){
                        lastKOID = matchComments[1]
                        matchComments = regComments.exec(dataComments);
                    }
                    if (koidsCIT.includes(lastKOID))
                    {
                        if (!keys.includes(ticket)){
                            keys.push(ticket);
                            ticketList.push(ticket);
                            console.log("Last comment not from CIT");
                        }
                    }
                    else
                    {
                        console.log("Last comment is from CIT");
                    }    
                    
                    
                    if (keys.length>0)
                        chrome.browserAction.setBadgeText({text: ""+keys.length});
                    else
                        chrome.browserAction.setBadgeText({text: ""});
                    
                    chrome.storage.local.set({keys: keys.join("|")}, function() {
                        console.log('Value is set to ' + keys);
                    });
                });
                
                checkComments(r, data, koidsCIT, keys);
            }
        }
    }
});
