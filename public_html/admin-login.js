//Slide down login menu upon page load
/*$(document).ready(function(){
		$("#login-overlay").css("top", 0);
		$("#wrapper").addClass("blur-filter");		
		$("#username").focus();	
});*/

//Upon successful login, hide meny
function hideLoginMenu(){	
	$("#login-overlay").css("top","-750px");
	$("#wrapper").removeClass("blur-filter");
	$("#username").css("box-shadow", "none");
	$("#password").css("box-shadow", "none");
	$("#username").val("");
	$("#password").val("");
	/*$("#login-error").css("display", "none");*/
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
	var active_filter = $(".active");
	var url = 'http://localhost:3000/admin/pieces?filter=' + filters[$('.filter').index(active_filter)] + '&order=' + order[(getRotationDegrees($('.active')) % 180) % 2];
	$.ajax({
		url: 'http://localhost:3000/login',
		method: 'POST',
		data: JSON.stringify({
			username: $("#username").val(),
			password: $("#password").val()
		}),
		contentType: 'application/json',
		statusCode: {
			200: function(){
				count = 0;
				$.ajax({
					url: url,
					methods: 'GET',
					statusCode: {
						500: function(){
							console.log('Server error');
						}
					},
					success: function(piecesArray, textStatus, jqXHR){
						piecesArray.forEach(function(piece){
							var entry = createNew(piece.title, piece.artist, piece.facility, piece.location, piece.id, piece.piece_crit);		
							$("#all-search-results-div").append(entry);
							var max = 0;
							$(".data-wrapper").each(function(){
								if($(this).height() > max){
									max = $(this).height();
								}
							});

							$(".data-wrapper").each(function(){
								var difference = max - $(this).height();
								var padding = difference / 2;
								$(this).css("padding", padding + "px 0");
							});
						});
						hideLoginMenu();
					}
				});	
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
			}

		}
	});
	count++;
	if(count == 3){
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
});
