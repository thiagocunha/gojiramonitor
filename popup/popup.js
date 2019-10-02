
$(window).focus(function(e) {
    chrome.storage.local.get(['keys'], function(result) {
		// Clearing the container
		$('#ulLista').html("");
		var lista = result.keys.split("|");
		lista.forEach(function (item){
			// One link for each ticket that needs atention
			$('#ulLista').append("<il><a target='_blank' href='https://jira.coke.com/jira/browse/"+item+"'>"+item+"</a></il>");
		});
	});
});