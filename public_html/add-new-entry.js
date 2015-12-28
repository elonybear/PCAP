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

function createNew(title, artist, facility, loc, id, piece_crit){
	var entry = 
		"<div class='search-result'>";
		console.log(piece_crit);
		if(piece_crit === true){
			entry += "<input class='critique-checkbox' type=checkbox disabled=true checked=true/>";
		}
		else{
			entry += "<input class='critique-checkbox' type=checkbox disabled=true/>";
		}
			entry += "<div class='data-wrapper title-div'><p class='search-result-data title-p'>" + title + "</p></div>" +
			"<div class='data-wrapper artist-div'><p class='search-result-data artist-p'>" + artist + "</p></div>" +
			"<div class='data-wrapper institution-div'><p class='search-result-data institution-p'>" + facility + "</p></div>" +
			"<div class='data-wrapper location-div' style='border-right: none'><p class='search-result-data location-p'>" + loc + "</p></div>" +
			"<div class='result-buttons'>" +
				"<a href='' class='result-button edit-save'><p>Edit</p></a>" +
				"<a href='' class='result-button remove-cancel'><p>Remove</p></a>" +
			"</div>" +
			"<input class='result-id' type=hidden value=" + id + ">" +
		"</div>";
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

	$(".barrier").css('height', max / 3);

	$(".barrier").each(function(){
		if($(this).height() > max){
			max = $(this).height();
		}
	});

	$(".barrier").each(function(){
		var difference = max - $(this).height();
		var margin = difference / 2;
		$(this).css("margin-top", margin + "px");
	});
}

$("#add-new-entry").click(function(e){			
	e.preventDefault();
	$("#wrapper").addClass("blur-filter");		
	$("#new-entry-overlay").fadeIn();
	$("#new-title-input").focus();	
});

$("#new-entry-x").click(function(e){
	e.preventDefault();
	$("#wrapper").removeClass("blur-filter");
	$("#new-entry-overlay").fadeOut();
	$(".login-input").val("");	
	$("#new-entry-form").children("p").each(function(){
		if($(this).css("display") == "block"){
			$(this).fadeOut();
			$("#new-entry-wrapper").css("height", $("#new-entry-wrapper").height() - 14 + "px");
		}
	});
});
var clicked = 0;
var filters = ['title_upper', 'artist_upper', 'facility_upper', 'location_upper', 'piece_crit'];
var order = ['ASC', 'DESC'];

$("#submit-new-entry").click(function(e){
	e.preventDefault();
	console.log("Submitting new entry");
	var active_filter = $(".active");
	var url = 'http://localhost:3000/pieces'
	$.ajax({
		url: url,
		method: 'POST',
		data: JSON.stringify({
			title: $("#new-title-input").val(),
			artist: $("#new-artist-input").val(),
			facility: $("#new-institution-input").val(),
			location: $("#new-location-input").val(),
			filter: filters[$('.filter').index(active_filter)],
			order: order[(getRotationDegrees($('.active')) / 180) % 2]
		}),
		contentType: 'application/json',
		statusCode: {
			500: function(){	
				console.log("Unsuccessful");	
				$("#location-error").fadeIn().delay(200).fadeOut();
			}
		},
		success: function(piecesArray, textStatus, jqXHR){
			$("#all-search-results-div").empty();
			piecesArray.forEach(function(piece){
				createNew(piece.title, piece.artist, piece.facility, piece.location, piece.id, piece.piece_crit);
			});
		}
	});
	$("#new-entry-x").click();
});

$(document).keypress(function(e) {
	if($("#new-entry-overlay").css("display") == "block"){
		if(e.which == 13){
			$("#submit-new-entry").click();
		}
	}
});
