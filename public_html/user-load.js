var filters = ['title_upper', 'artist_upper', 'facility_upper', 'location_upper'];
var order = ['ASC', 'DESC'];

function getUrlVars(){
	var vars = [], hash;
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for(var i = 0; i < hashes.length; i++){
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	return vars;
}

function createNew(title, artist, facility, location, id){
	var entry = "<div class='search-result uncritiqued user'>" +
					"<div class='data-wrapper'>" +
						"<div>" +
							"<p class='search-result-data title-p'>" + title + "</p>" +
							"<div class='clearer'></div>" +
						"</div>" +
						"<div>" +
							"<p class='search-result-data artist-p'>" + artist + "</p>" +
							"<p class='search-result-data institution-p'>" + facility + "</p>" +
							"<p class='search-result-data location-p'>" + location + "</p>" +
						"</div>" +
					"</div>" +
					"<input class='result-id' type=hidden value=" + id + ">" +
				"</div>";
	return entry;
				
}

function loadEntries(){
	var active_filter = $('.active');
	var degrees = parseInt(getUrlVars()['degree']);
	var url;
	if(location.hostname == 'localhost') {
		url = 'http://localhost:3000/user/pieces?filter=' + filters[$('.filter').index(active_filter)];
	}
	else {
		url = 'http://pcap-database.herokuapp.com/user/pieces?filter=' + filters[$('.filter').index(active_filter)];
	}
	if(degrees){
		url += '&order=' + order[Math.floor(degrees / 180)];
	}
	else{
		url += '&order=ASC';
	}
	console.log(url);
	$.ajax({
		url: url, 
		methods: 'GET',
		statusCode: {
			500: function(){
				console.log('Server error');
			}
		},
		success: function(piecesArray, textStatus, jqXHR){
			console.log(JSON.stringify(piecesArray));
			var max_rows = Math.ceil(piecesArray.length / 2);
			if(max_rows === 0){
				max_rows = 1;
			}
			for(var i = 0; i < piecesArray.length; i++){
				var piece = piecesArray[i];
				var entry = createNew(piece.title, piece.artist, piece.facility, piece.location, piece.id);
				if(i < max_rows){
					$('#left-column').append(entry);
					if(piece.piece_crit === true){
						$('#left-column').find('.search-result').last().addClass('critiqued');
						$('#left-column').find('.search-result').last().removeClass('uncritiqued');
					}
				}
				else{
					$('#right-column').append(entry);
					if(piece.piece_crit === true){
						$('#right-column').find('.search-result').last().addClass('critiqued');
						$('#right-column').find('.search-result').last().removeClass('uncritiqued');
					}
				}
			}			
			if($('#left-column').children().length > 0){
				$('#left-column').children().first().addClass('first');
			}	
			if($('#right-column').children().length > 0){
				$('#right-column').children().first().addClass('first');
			}	
		}
	});
}

$(document).ready(function(){
	var query = getUrlVars();
	var filter = query['filter'];
	var degree = query['degree'];
	if(filter){
		if(filter === 'artist'){
			$('#name').addClass('active');
			$('#name').removeClass('inactive');
			$('#name .triangle-filter').removeClass('inactive-triangle');
		}
		else if(filter === 'facility'){
			$('#institution').addClass('active');
			$('#institution').removeClass('inactive');
			$('#institution .triangle-filter').removeClass('inactive-triangle');
		}
		else if(filter === 'location'){
			$('#location').addClass('active');
			$('#location').removeClass('inactive');
			$('#location .triangle-filter').removeClass('inactive-triangle');
		}
		else if(filter === 'critique'){
			$('#critique').addClass('active');
			$('#critique').removeClass('inactive');
			$('#critique .triangle-filter').removeClass('inactive-triangle');
		}
		else{
			$('#piece').addClass('active');
			$('#piece').removeClass('inactive');
			$('#piece .triangle-filter').removeClass('inactive-triangle');
		}
		if(degree){
			$('.active .triangle-filter').css('transform', 'rotate(' + degree + 'deg)');
		}
	}
	else{
		$('#piece').addClass('active');
		$('#piece').removeClass('inactive');
		$('#piece .triangle-filter').removeClass('inactive-triangle');	
	}
	loadEntries();
});
