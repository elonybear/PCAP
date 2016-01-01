//Slide down login menu upon page load

function CheckLoggedInStatus(){
	$.ajax({
		url: 'http://localhost:3000/time',
		method: 'GET',
		statusCode: {
			401: function(){
				$("#login-overlay").css("top", 0);
				$("#wrapper").addClass("blur-filter");		
				$("#username").focus();	
			},
			404: function(){
				$("#password-overlay").css("top", "0px");
				$("#wrapper").addClass("blur-filter");
				$("#new_password").focus();
			}
		},
		success: function(time, textStatus, jqXHR){
			var now = new Date($.now());
			var date = new Date(time);
			if(date.getFullYear() === now.getFullYear() 
			   && date.getMonth() === now.getMonth() 
		   		&& date.getDay() === now.getDay() 
				&& (now.getTime() - date.getTime()) < 1000*3600){
					$.ajax({
						url: 'http://localhost:3000/time',
						method: 'POST',
						data: JSON.stringify({
							time: now
						}),
						contentType: 'application/json',
						statusCode: {
							204: function(){
								loadEntries();
							}
						}
					});
			}
			else{
				$("#login-overlay").css("top", 0);
				$("#wrapper").addClass("blur-filter");		
				$("#username").focus();	
			}
		}
	});
}

function loadEntries(){
	var active_filter = $(".active");
	var degrees = parseInt(getUrlVars()['degree']);
	var url = 'http://localhost:3000/admin/pieces?filter=' + filters[$('.filter').index(active_filter)];
	if(degrees){
		url += '&order=' + order[Math.floor(degrees / 180)];
	}
	else{
		url += '&order=ASC';
	}
	$.ajax({
		url: url,
		methods: 'GET',
		statusCode: {
			500: function(){
				console.log('Server error');
			}
		},
		success: function(piecesArray, textStatus, jqXHR){
			var max_rows = Math.ceil(piecesArray.length / 2);
			if(max_rows === 0){
				max_rows = 1;
			}
			$.ajax({
				url: 'http://localhost:3000/number',
				method: 'POST',
				data: JSON.stringify({
					max_rows: max_rows
				}),
				contentType: 'application/json'
			});
			for(var i = 0; i < piecesArray.length; i++){
				var piece = piecesArray[i];
				var entry = createNew(piece.title, piece.artist, piece.facility, piece.location, piece.id, piece.piece_crit);		
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
			hideLoginMenu();
		}
	});	
}

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
		CheckLoggedInStatus();
	}
});

//Upon successful login, hide meny
function hideLoginMenu(){	
	$("#login-overlay").css("top","-750px");
	$("#wrapper").removeClass("blur-filter");
	$("#username").css("box-shadow", "none");
	$("#password").css("box-shadow", "none");
	$("#username").val("");
	$("#password").val("");
}

function hidePasswordMenu(){
	$("#password-overlay").css("top","-750px");
	$("#wrapper").removeClass("blur-filter");
	$("#new_password").css("box-shadow", "none");
	$("#confirm_password").css("box-shadow", "none");
	$("#new_password").val("");
	$("#confirm_password").val("");
}

//Upon clicking the x in the login menu, return to user page
$("#login-x").click(function(e){
	e.preventDefault();
	window.location = "user.html";
});

//Submit login - 3 unsuccessful returns to user page
//Successful login hides menu
var count = 0;
var filters = ['title_upper', 'artist_upper', 'facility_upper', 'location_upper'];
var order = ['ASC', 'DESC'];

$("#submit-login").click(function (e) {
	e.preventDefault();
	$.ajax({
		url: 'http://localhost:3000/login',
		method: 'POST',
		data: JSON.stringify({
			username: $("#username").val(),
			password: $("#password").val(),
			time: new Date($.now())
		}),
		contentType: 'application/json',
		statusCode: {
			200: function(){
				loadEntries();
			},
			401: function(){	
				count++;
				$("#password").val("");
				if($("#login-error").css("display") == "none"){
					$("#login-error").fadeIn();
					$("#login-wrapper").css("height", "250px");
				}
				else{
					$("#login-error").animate({
						"color":"#FAAC58"	
					}, 200, function(){
						$("#login-error").animate({
							"color":"#FA5858"
						});
					});
				}
			},
			404: function(){
				
			}
		}
	});
	count++;
	if(count == 3){
		window.location = "user.html";	
	}
});

$("#submit-password").click(function(e){
	e.preventDefault();
	if($("#new_password").val() != $("#confirm_password").val()){
		//Error message
		if($("#password-error").css("display") == "none"){
			$("#password-error").fadeIn();
			$("#password-wrapper").css("height", "250px");
		}
		else{
			$("#password-error").animate({
				"color":"#FAAC58"	
			}, 200, function(){
				$("#password-error").animate({
					"color":"#FA5858"
				});
			});
		}
	}
	else{
		console.log('Setting new password');
		$.ajax({
			url: 'http://localhost:3000/password',
			method: 'POST',
			data: JSON.stringify({
				password: $('#new_password').val()
			}),
			contentType: 'application/json',
			success: function(){
				hidePasswordMenu();
				$("#login-overlay").css("top", 0);
				$("#wrapper").addClass("blur-filter");		
				$("#username").focus();	
			}
		});
	}
});

//Press enter to submit login
$(document).keypress(function(e) {
	if($("#login-overlay").css("top") != "-750px"){
		if(e.which == 13){
			$("#submit-login").click();
		}
	}
	else if($("#password-overlay").css("top") != "-750px"){
		if(e.which == 13){
			$("#submit-login").click();
		}
	}
});
