$('#clear-database-x').click(function(e){
	e.preventDefault();
	$("#wrapper").removeClass("blur-filter");
	$("#overlay").fadeOut();
	$("#update-wrapper").fadeOut(100).delay(500)
	.queue(function (next) { 
    	$("#update-wrapper").css("right", "-350px"); 
    	next(); 
  }).fadeIn();
	$("#clear-wrapper").fadeOut(100).delay(500).queue(function (next) { 
    	$("#clear-wrapper").css("right", "-400px"); 
    	next(); 
  }).fadeIn();
 $("#clear-wrapper input").val("");
});

$('#submit-clear-database').click(function(e){
	e.preventDefault();
	var url;
	if(location.hostname == 'localhost') {
		url = 'http://localhost:3000/all';
	}
	else {
		url = 'http://pcap.herokuapp.com/all';
	}
	$.ajax({
		url: url,
		method: 'DELETE',
		data: JSON.stringify({
			username: $('#clear-username').val(),
			password: $('#clear-password').val()
		}),
		contentType: 'application/json',
		statusCode: {
			204: function(){
				$('#left-column').empty();
				$('#right-column').empty();
				$("#clear-database-x").click();
			},
			401: function(){	
				$("#clear-database-error").css('opacity', '1');
				setTimeout(function(){
					$("#clear-database-error").css('opacity', 0);
				}, 2000);
			},
			500: function(){
				console.log('Server error');
			}
		}
	});
});

$(document).keypress(function(e) {
	if($("#clear-wrapper").css("right") != "-400px"){
		if(e.which == 13){
			$("#submit-clear-database").click();
		}
	}
});
