function initiateSearch(user){
	
	var active_filter = $('.active');

	if($("#results-search-bar").val()){
		console.log('Search bar not empty');
		var url = 'http://localhost:3000/search?user=';
		if(user === 'true'){
			url += 'user';
		}
		else{
			url += 'admin'
		}
		url += '&q=' + $("#results-search-bar").val() 
				+ '&filter=' + filters[$('.filter').index(active_filter)] 
				+ '&order=' + order[(getRotationDegrees($('.active')) / 180) % 2];	

		$.ajax({
			url: url,
			method: 'GET',
			statusCode: {
				500: function(){
					console.log('Unsuccessful search');
				}
			},
			success: function(piecesArray, textStatus, jqXHR){
				/*$("#all-search-results-div").empty();
				piecesArray.forEach(function(piece){
					createNew(piece.title, piece.artist, piece.facility, piece.location, piece.id, piece.piece_crit);
				});*/
				$('#all-search-results-div').children().each(function(){
					var i = 0;
					for(; i < piecesArray.length; i++){
						if(piecesArray[i].id.toString() === $(this).children('.result-id').val()){
							$(this).css('display', 'block');
							break;
						}
					}
					if(i === piecesArray.length){
						$(this).css('display', 'none');
					}
				});
			}
		})
	}
	else{
		$('#all-search-results-div').children().each(function(){
			$(this).css('display', 'block');	
		});
	}
}

$(document).keyup(function(e){
	if($('#results-search-bar').is(':focus')){
		e.preventDefault();
		initiateSearch(window.location == 'user.html');	
	}
});

$('#results-search-button-a').on('click', function(e){
	e.preventDefault();
	console.log('Search initiated');
	initiateSearch(window.location == 'user.html');
});

$(document).keypress(function(e){
	if($('#results-search-bar').is(':focus')){
		if(e.which == 13){
			$('#results-search-button-a').click();
		}
	}	
});
