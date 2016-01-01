// Change/flip active filter
var active = 0;
var flip = getUrlVars['degree'] || 0;
$(".filter").click(function(e){
	e.preventDefault();
	var file = window.location.href.substr((window.location.href.lastIndexOf('/') + 1));
	file = file.split('?')[0];
	var url;
	if($(this).hasClass('active')){
		var query = getUrlVars();
		var degree = query['degree'];
		if(degree){
			var new_degree = (((parseInt(degree) + 180) / 180) % 2) * 180;
			url = 'http://localhost:3000/' + file + '?filter=' + $(this).find('p').html().toLowerCase() + '&degree=' + new_degree;	
		}
		else if($(this).find('p').html() != 'Title'){
			url = 'http://localhost:3000/' + file + '?filter=piece&degree=0';	
		}
		else{
			url = 'http://localhost:3000/' + file + '?filter=piece&degree=180';	
		}
	}
	else{
		url = 'http://localhost:3000/' + file + '?filter=' + $(this).find('p').html().toLowerCase() + '&degree=0';
	}
	window.location.href = url;
});
