"use strict";

var genHandler = function (request, sender, sendResponse) {
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
        var tab = {};
        for (var i=0;i<tabs.length;i++){
            tab = parseInt(tabs[i].id);
            break;
        }
        
        console.log(request.type);
        console.log(tab);
        chrome.tabs.sendMessage(tab, {action: request.type, data: request.data}, function (response) {
            console.log("callback 1");
            if (!response)
                console.log(chrome.runtime.lastError.message);
            if (response){
                console.log("callback 2");
                console.log(response);
                if (response.notifyTotal){
                    console.log("callback 2a");
                    chrome.browserAction.setBadgeText({text: response.notifyTotal});
                }
            }

            console.log("callback 3");
            
            if (sendResponse){
                console.log("cb4");
            
                sendResponse(response);
            }
            console.log("callback 5");
            
        });
    });
};

const requestTypes = {
	open: genHandler,
    notify: genHandler,
    alarm: genHandler,
    crawler: genHandler};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request.type);

    if (request.type == "notify"){
        chrome.browserAction.setBadgeText({text: request.notifyTotal});
    }
    else if (request.type in requestTypes) {
        console.log("calling");

        
        
        //genHandler(request, sender, sendResponse);
    }
 
    return true;
});


chrome.alarms.create("jiraMon", {
    delayInMinutes: 1,
    periodInMinutes: 5
});


chrome.alarms.onAlarm.addListener(function(alarm) {
    if (alarm.name === "jiraMon") {
        $.ajax("https://jira.coke.com/jira/rest/gadget/1.0/issueTable/filter?num=10&tableContext=jira.table.cols.dashboard&addDefault=false&columnNames=issuekey&columnNames=summary&columnNames=lastViewed&enableSorting=true&paging=true&showActions=true&filterId=31627&sortBy=&startIndex=0&_=1569954812196").done(function( data ) {
            // chrome.runtime.sendMessage({type: "notify", notifyTotal: indice.toString()});
            var r = new RegExp(/(?:issuekey=.(AEM-\d*))/, 'gm');
            var keys = [];
            var match = r.exec(data.table);
            while(match !== null){
                console.log(match);
                keys.push(match[1]);
                match = r.exec(data.table);
            }
            //sendResponse({output: keys});
            if (keys.length>0)
                chrome.browserAction.setBadgeText({text: ""+keys.length});
            else
                chrome.browserAction.setBadgeText({text: ""});
        });
    }
});
