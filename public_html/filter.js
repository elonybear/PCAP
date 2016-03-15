// change/flip active filter
function geturlvars(){
	var vars = [], hash;
	var hashes = window.location.href.slice(window.location.href.indexof('?') + 1).split('&');
	for(var i = 0; i < hashes.length; i++){
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	return vars;
}

var active = 0;
var flip = geturlvars['degree'] || 0;
$(".filter").click(function(e){
	e.preventdefault();
	var file = window.location.href.substr((window.location.href.lastindexof('/') + 1));
	file = file.split('?')[0];
	var url;
	if(location.hostname == 'localhost') {
		url = 'http://localhost:3000/' + file + '?filter=';
	}
	else {
		url = 'http://pcap-database.herokuapp.com/' + file + '?filter=';
	}
	if($(this).hasClass('active')){
		var query = getUrlVars();
		var degree = query['degree'];
		if(degree){
			var new_degree = (((parseInt(degree) + 180) / 180) % 2) * 180;
			url += $(this).find('p').html().toLowerCase() + '&degree=' + new_degree;	
		}
		else if($(this).find('p').html() != 'Title'){
			url += 'piece&degree=0';	
		}
		else{
			url += 'piece&degree=180';	
		}
	}
	else{
		url += $(this).find('p').html().toLowerCase() + '&degree=0';
	}
	window.location.href = url;
});
