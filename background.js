"use strict";

var genHandler = function (request, sender, sendResponse) {
    chrome.tabs.query({}, function (tabs) {
        var tab = {};
        for (var i=0;i<tabs.length;i++){
            if (tabs[i].url.includes("aem6-4")){
                tab = parseInt(tabs[i].id);
            }
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
        genHandler(request, sender, sendResponse);
    }
 
    return true;
});

/*
chrome.alarms.create("jiraMon", {
    delayInMinutes: 1,
    periodInMinutes: 1
});


chrome.alarms.onAlarm.addListener(function(alarm) {
    if (alarm.name === "jiraMon") {
        genHandler({type: "alarm"}, {}, function(p){
            console.log("cb1");
        });
    }
});
*/