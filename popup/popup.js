
let tool = document.getElementById('run');

tool.addEventListener('click', () => {

	chrome.tabs.query({currentWindow: true}, function(tabs) {
		console.log("query");
		let txt = document.getElementById('text');
		let url = tabs[0].url;
		if (url.match(/aem6-4/)) {
			chrome.runtime.sendMessage({type: "crawler", data: document.getElementById('txtLinhas').value}, (response) => {
				console.log(response);
				if (response && response.output)
					document.getElementById('txtResultado').value = response.output.join("\n");

				txt.className = 'success';
				txt.innerHTML = 'Connected';
				
				return true;
			});
		} 
	});
});
/*
tool = document.getElementById('auth');
tool.addEventListener('click', () => {

	
		console.log('fetch btn press');
		chrome.identity.getAuthToken({interactive: true}, function(token) {
		  console.log(token);
		  //GET DATA HERE WITH FETCH()??
		});
	  
});
*/
tool = document.getElementById('open');

tool.addEventListener('click', () => {

	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		console.log("query");
		let txt = document.getElementById('text');
		let url = tabs[0].url;
		if (url.match(/jira.domain.com/)) {
			chrome.runtime.sendMessage({type: "notify"}, (response) => {
		
				txt.className = 'success';
				txt.innerHTML = 'Connected';
				
				return true;
			});
		} else {
			chrome.runtime.sendMessage({type: "notify"}, (response) => {
		
				txt.className = 'warning';
				txt.innerHTML = 'Incorrect Url';
				
				return true;
			});
			
		}
	});
});
