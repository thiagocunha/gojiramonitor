"use strict";

const requestActions = {
	crawler: function(request, sender, sendResponse){
		console.log("step 1a");
		/*let monitor = new JiraMon.Monitor();
		monitor.MonitorTickets();
		console.log("step 2");
		*/
		$.ajax("https://jira.coke.com/jira/secure/Dashboard.jspa?selectPageId=21801").done(function( data ) {
			// chrome.runtime.sendMessage({type: "notify", notifyTotal: indice.toString()});
			sendResponse({output: data});
		});
		
	},
	alarm: function(request){
		console.log("step 1");
		/*let monitor = new JiraMon.Monitor();
		monitor.MonitorTickets();
		console.log("step 2");
		*/
	},
	notify: function(request, sender, sendResponse){
		console.log("notifying");
		console.log(sender);
		//chrome.browserAction.setBadgeText({text: "10+"});
		sendResponse({status: 'success'});
		console.log("teste");
	},	
	open: function (request, sender, sendResponse) {
		$('body').empty();
		$('body').css({'height': '100% !important'});
		$('<iframe/>', {
			name: 'LinFrame',
			src: chrome.extension.getURL('app/app.html'),
			scrolling: 'no'
		}).css({
			width: '100%', 
			height: '100%',
			position: 'absolute',
			top: '0',
			left: '0'
		}).appendTo('body');
		
		sendResponse({status: 'success'});
	}
};


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

	console.log("aqui");
	if (request.action in requestActions) {
		console.log("aqui2");
		requestActions[request.action](request, sender, sendResponse);
	}

	return true;
});
