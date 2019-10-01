"use strict";

const requestActions = {
	crawler: function(request, sender, sendResponse){
		console.log("step 1a");
		/*let monitor = new JiraMon.Monitor();
		monitor.MonitorTickets();
		console.log("step 2");
		*/
		var lista = request.data.split("\n");
		var listaPaths = [];
		var output = "";
		function execRequests(lista, indice, output){
			var item = lista[indice];
			console.log(item);
			$.ajax(item).done(function( data ) {
				//output = JSON.stringify(data);
				//console.log(output);
				data.pages.forEach(function(item){
					console.log(item.srcPath);
					if (!listaPaths.includes(item.srcPath))
					{
						listaPaths.push(item.srcPath);
					}
				});
				if (indice < lista.length-1) //lista.length-1
				{
					chrome.runtime.sendMessage({type: "notify", notifyTotal: indice.toString()});
					execRequests(lista, indice +1, output);
				}
				else{
					sendResponse({output: listaPaths});
				}
				
			});
		}
		execRequests(lista, 0, output);
		
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
