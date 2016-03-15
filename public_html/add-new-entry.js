var MAX_COLUMN_SIZE = 1;

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
	var entry; 
		console.log(piece_crit);
		if(piece_crit === true){
			entry = "<div class='search-result critiqued'>";
		} else{
			entry = "<div class='search-result uncritiqued'>";
		}
		
		entry += "<div class='data-wrapper'>" +
					"<div>" +
						"<p class='search-result-data title-p'>" + title + "</p>" +
						"<div class='clearer'></div>" +
					"</div>" +
					"<div>" +
						"<p class='search-result-data artist-p'>" + artist + "</p>" +
						"<p class='search-result-data institution-p'>" + facility + "</p>" +
						"<p class='search-result-data location-p'>" + loc + "</p>" +
						"<div class='clearer'></div>" +
					"</div>" +
					"<div class='result-buttons'>" +
						"<a href='' class='result-button edit-save'><p>Edit</p></a>" +
						"<a href='' class='result-button remove-cancel'><p>Remove</p></a>" +
					"</div>" +
				"</div>" +
				"<input class='result-id' type=hidden value=" + id + ">" +
			"</div>" + 
			"<div class='critique-div'>" +
				"<p class='critique-p'>Critiqued?</p>";
				if(piece_crit === true){
					entry += "<input type=checkbox class='critique-checkbox' checked/>";
				}
				else{
					entry += "<input type=checkbox class='critique-checkbox'/>";
				}
			entry += "</div>";
					
			
		return entry;
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
});
var clicked = 0;
var filters = ['title_upper', 'artist_upper', 'facility_upper', 'location_upper', 'piece_crit'];
var order = ['ASC', 'DESC'];

$("#submit-new-entry").click(function(e){
	e.preventDefault();
	console.log("Submitting new entry");
	var active_filter = $(".active");
	var url;
	if(location.hostname == "localhost"){
		url = 'http://localhost:3000/pieces';
	}
	else {
		url = 'http://pcap-database.herokuapp.com/pieces';
	}
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
				$("#create-new-error").css('opacity', '1');
				setTimeout(function(){
					$("#create-new-error").css('opacity', 0);
				}, 2000);
			}
		},
		success: function(pieceStruct, textStatus, jqXHR){
		 	var piecesArray = pieceStruct.all_pieces;
			var new_piece = pieceStruct.new_piece;
			var entry = createNew(new_piece.title, new_piece.artist, new_piece.facility, new_piece.location, new_piece.id, new_piece.piece_crit);
			var MAX_COLUMN_SIZE = pieceStruct.max_rows * 2;
			$("#new-entry-x").click();
			location.reload();
		} //end success
	});
});

$(document).keypress(function(e) {
	if($("#new-entry-overlay").css("display") == "block"){
		if(e.which == 13){
			$("#submit-new-entry").click();
		}
	}
});
