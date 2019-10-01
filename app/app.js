"use strict";

// Hide menus
$('#draw').hide();
$('#download').hide();
$('.loading').hide();


// Refresh page
$('.logo').on('click', ()=> {
	location.reload(true);
});

// Redirect to linkedin page
$('#quit').on('click', () => {
	top.location.href= 'https://www.linkedin.com';
});


$('#recently').on('click', ()=> {

	$('.loading').show();

	storage.local.getAllStorageArea((err, response) => {
		if (err) {
			console.log(err);
			return;
		}

		$('#modalContainer').css({display: 'block'});
		$('.modal-title').html('Recently History');
		$('.loading').hide();

		$('.modal-body').append('<div id="history"></div>');
		let arr = response.ids;

		$('<table/>').addClass('table-history').appendTo('#history');
		let winHeight = $(window).height();
		$('#history').css({height: 3*winHeight/4});
		$('.table-history').append('<tr><td class="table-header">Date</td><td class="table-header">Size</td><td class="table-header">Action</td>');

		arr.forEach((res) => {

			let timeId = linutil.util.getIdFromHistoryName(res.key);
			let date = linutil.util.getDateFromTime(timeId);
			let length = res.length;

			$('.table-history').append('<tr id="row_'+timeId+'"><td>'+date+'</td><td>'+length+'</td><td><a href="#" id="d_'+timeId+'"class="actDownload">Download</a> <a href="#" id="r_'+timeId+'"class=" actDelete">Delete</a></td>');
		});

		$('.actDownload').on('click', (e) => {
			let id = e.target.id.substring(e.target.id.indexOf('d_')+2);

			storage.local.getStorageArea('LinGraph:'+id, (err, res) => {
				if (err) {
					alert('Sorry, an error occurred. Try again !');
					return;
				}

				$('.loading').show();
				linutil.util.download(res, 'gdf', () => {
					$('.loading').hide();
				});
			});
		});

		$('.actDelete').on('click', (e) => {
			let id = e.target.id.substring(e.target.id.indexOf('r_')+2);

			let result = confirm('Are you sure to delete ?');
			
			if (result) {
				storage.local.removeStorageArea('LinGraph:'+id, (err, res) => {
					if (err) {
						alert('Sorry, an error occurred. Try again !');
						return;
					}

					$('table tr#row_' + id).remove();
				});
			}
		}); 
	});
});

$('.close').on('click', () => {
	$('#modalContainer').css({display: 'none'});
	$('.modal-body').empty();
});


$('#start').on('click', () => {
	
	$('.loading').show();

	chrome.runtime.sendMessage({type: "start"}, (response) => {

		$('.loading').hide();

		if (response.status === 'success') {

			storage.local.setStorageArea(response, () => {
				console.log('LinkedGraph saved.');
			});

			$('.log').html('<p class="success">Graph - Successfully</p>');

			$('#draw').show();
			$('#download').show();
			$('#start').hide();

			$('#draw').on('click', ()=> {

				$('#modalContainer').css({display: 'block'});
				$('.modal-title').html('Graph');
				$('.modal-body').append('<div id="cy"></div>');
				let winHeight = $(window).height();
				$('#cy').css({height: 3*winHeight/4});

				linutil.util.draw(response.data);
			});
			
			$('#download').on('click', ()=> {
				$('.loading').show();

				linutil.util.download(response.data, 'gdf', () => {
					$('.loading').hide();
				});
			});

		} else {
			let status = '';
			if (response.data.err.length > 0) {
				status = response.data.err[0].status;
			}
			$('.log').html(`<p class="warning">Sorry, an error occurred. Try again later! - ${status}</p`);
		}

		return true;
	});
});

$('#cluster-skill').on('click', () => {
	$('.loading').show();

	chrome.runtime.sendMessage({type: 'skill'}, (response) => {
		$('.loading').hide();

		if (response.status === 'success') {

			linutil.util.download(response.data, 'json', () => {
				$('.loading').hide();
				$('.log').html('<p class="success">Skill - Successfully</p>');
			});
		} else {
			let status = '';
			if (response.data.err.length > 0) {
				status = response.data.err[0].status;
			}
			$('.log').html(`<p class="warning">Sorry, an error occurred. Try again later! - ${status}</p`);
		}
	});
});

//Resize window modal contents
$(function () {

	$(window).bind('load resize', () => {
		let winHeight = $(window).height();
		$('#history').css({height: 3*winHeight/4});
		$('#cy').css({height: 3*winHeight/4});
	});
});
