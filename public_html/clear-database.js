$('#clear-database').click(function(e){
	e.preventDefault();
	$('#wrapper').addClass('blur-filter');
	$('#clear-database-overlay').fadeIn();
	$('#clear-username').focus();
});

$('#clear-database-x').click(function(e){
	e.preventDefault();
	$("#wrapper").removeClass("blur-filter");
	$("#clear-database-overlay").fadeOut();
	$(".login-input").val("");	
});

$('#submit-clear-database').click(function(e){
	e.preventDefault();
	$.ajax({
		url: 'http://localhost:3000/all',
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
				$('#wrapper').removeClass('blur-filter');
				$('#clear-database-overlay').fadeOut();
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
	if($("#clear-database-overlay").css("display") == "block"){
		if(e.which == 13){
			$("#submit-clear-database").click();
		}
	}
});
