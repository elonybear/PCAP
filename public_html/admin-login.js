//Slide down login menu upon page load

function CheckLoggedInStatus(){
	var url;
	if(location.hostname == 'localhost') {
		url = 'http://localhost:3000/time';
	}
	else {
		url = 'http://pcap-database.herokuapp.com/time';
	}
	$.ajax({
		url: url,
		method: 'GET',
		statusCode: {
			401: function(){
				$("#login-overlay").css("top", 0);
				$("#wrapper").addClass("blur-filter");		
				$("#username").focus();	
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
						url: url,
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
	var url_load;
	if(location.hostname == 'localhost') {
		url_load = 'http://localhost:3000/';
	}
	else {
		url_load = 'http://pcap-database.herokuapp.com/';
	}
	
	url_load += 'admin/pieces?filter=' + filters[$('.filter').index(active_filter)];
	if(degrees){
		url_load += '&order=' + order[Math.floor(degrees / 180)];
	}
	else{
		url_load += '&order=ASC';
	}
	$.ajax({
		url: url_load,
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
			var url_post_number;
			if(location.hostname == 'localhost') {
				url_post_number = 'http://localhost:3000/number';
			}
			else {
				url_post_number = 'http://pcap-database.herokuapp.com/number';
			}
			$.ajax({
				url: url_post_number,
				method: 'POST',
				data: JSON.stringify({
					max_rows: max_rows
				}),
				contentType: 'application/json',
				success: function(){
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
					hideLoginMenu();
				}
			});
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
	}
	else{
		$('#piece').addClass('active');
		$('#piece').removeClass('inactive');
		$('#piece .triangle-filter').removeClass('inactive-triangle');	
	}
	CheckLoggedInStatus();
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

function hideChangePasswordMenu(){
	$("#change-password-overlay").css("top","-750px");
	$("#wrapper").removeClass("blur-filter");
	$("#new_password").css("box-shadow", "none");
	$("#confirm_password").css("box-shadow", "none");
	$("#new_password").val("");
	$("#confirm_password").val("");
	$("#old_password").css("box-shadow", "none");
	$("#old_password").val("");
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
				$("#login-error").css('opacity', '1');
				setTimeout(function(){
					$("#login-error").css('opacity', 0);
				}, 2000);
			}
		}
	});
	if(count == 3){
		hideLoginMenu();
		window.location = "user.html";	
	}
});

//Press enter to submit login
$(document).keypress(function(e) {
	if($("#login-overlay").css("top") != "-750px"){
		if(e.which == 13){
			$("#submit-login").click();
		}
	}
	else if($("#change-password-overlay").css('top') != '-750px'){
		if(e.which == 13){
			$('#submit-change-password').click();
		}
	}
});

$('#admin-profile').click(function(e){
	e.preventDefault();
	if($('#admin-dropdown-menu').height() > 0){
		$('#admin-dropdown-menu').css('height', '0');
		setTimeout(function(){
			$('#admin-dropdown-menu').css('border-bottom', 'none');
		}, 500);
	}	
	else{  
		$('#admin-dropdown-menu').css('height', '68px');
		$('#admin-dropdown-menu').css('border-bottom', '1px solid #d5d5d5');
	}
});


$('#change-password').click(function(e){		
	e.preventDefault();
	$("#change-password-overlay").css("top", 0);
	$("#wrapper").addClass("blur-filter");		
	$("#old_password").focus();	
	$('#admin-dropdown-menu').css('height', '0');
	setTimeout(function(){
		$('#admin-dropdown-menu').css('border-bottom', 'none');
	}, 500);
});

$('#submit-change-password').click(function(e){
	e.preventDefault();	
	if($("#new_password_change").val() != $("#confirm_password").val()){
		//Error message
		$("#password-error").css('opacity', '1');
		setTimeout(function(){
			$("#password-error").css('opacity', 0);
		}, 2000);
	}
	else{
		$.ajax({
			url: 'http://localhost:3000/password',
			method: 'POST',
			data: JSON.stringify({
				old_password: $('#old_password').val(),
				new_password: $('#new_password_change').val()
			}),
			contentType: 'application/json',
			success: function(){
				hideChangePasswordMenu();	
			}
		});
	}
});

$("#change-password-x").click(function(e){
	e.preventDefault();
	$("#wrapper").removeClass("blur-filter");
	$("#change-password-overlay").fadeOut();
	$(".login-input").val("");		
	$('#admin-dropdown-menu').css('height', '0');
	setTimeout(function(){
		$('#admin-dropdown-menu').css('border-bottom', 'none');
	}, 500);
});

$("#logout").click(function(e){
	$.ajax({
		url: 'http://localhost:3000/logout',
		method: 'GET',
		success: function(){
			window.location = 'user.html';
		}
	});
});
