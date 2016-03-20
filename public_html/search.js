function getRotationDegrees(obj) {
	var matrix = obj.css('-webkit-transform') ||
				obj.css('-moz-transform')
				obj.css('-ms-transform')
				obj.css('-o-transform')
				obj.css('transform');
	if(matrix !== 'none'){
		var values = matrix.split('(')[1].split(')')[0].split(',');
		var a = values[0];
		var b = values[1];
		var angle = Math.round(Math.atain2(b,a) * (180/Math.PI));
	} else {
		var angle = 0;
	}
	return (angle < 0) ? angle + 360 : angle;
}

function initiateSearch(user){	
	var active_filter = $('.active');
	if($("#results-search-bar").val()){
		console.log('Search bar not empty');
		var url;
		if(location.hostname == 'localhost') {
			url = 'http://localhost:3000/search?user=';
		}
		else {
			url = 'http://pcap.herokuapp.com/search?user=';
		}
		if(user === 'true'){
			url += 'user';
		}
		else{
			url += 'admin'
		}
		url += '&q=' + $("#results-search-bar").val() 
				+ '&filter=' + filters[$('.filter').index(active_filter)] 
				+ '&order=' + order[(getRotationDegrees($('.active')) / 180) % 2];	
		console.log(url);
		$.ajax({
			url: url,
			method: 'GET',
			statusCode: {
				500: function(){
					console.log('Unsuccessful search');
				}
			},
			success: function(piecesArray, textStatus, jqXHR){
				if(user === 'true'){
					$('#all-search-results-div').children().each(function(){
						$(this).find('.search-result').each(function(){
							var i = 0;
							for(; i < piecesArray.length; i++){
								if(piecesArray[i].id.toString() === $(this).children('.result-id').val()){
									$(this).css('display', 'block');
									$(this).next().css('display', 'block');
									break;
								}
							}
							if(i === piecesArray.length){
								$(this).css('display', 'none');
								$(this).next().css('display', 'none');
							}	
						});
					});
				}
				else {
					$('#all-search-results-div').children().each(function(){
						$(this).find('.search-result').each(function(){
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
					});
				}
			}
		})
	}
	else{
		if(user === 'true'){
			$('#all-search-results-div').children().each(function(){
				$(this).find('.search-result').each(function(){
					$(this).css('display', 'block');		
					$(this).next().css('display', 'block');
				})
			});
		}
		else {
			$('#all-search-results-div').children().each(function(){
				$(this).find('.search-result').each(function(){
					$(this).css('display', 'block');
				})
			});
		}
	}
}

$(document).keyup(function(e){
	if($('#results-search-bar').is(':focus')){
		e.preventDefault();
		console.log(window.location.pathname);
		initiateSearch(window.location.pathname === '/user.html');	
	}
});

$('#results-search-button-a').on('click', function(e){
	e.preventDefault();
	console.log('Search initiated');
	console.log(window.location.pathname);
	initiateSearch(window.location.pathname === '/user.html');
});

$(document).keypress(function(e){
	if($('#results-search-bar').is(':focus')){
		if(e.which == 13){
			$('#results-search-button-a').click();
		}
	}	
});
