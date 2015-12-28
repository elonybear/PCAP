//Mouse over buttons in a result
$(document).on("mouseover", ".result-button", function(){
	$(this).children().css({
		"color":"#00BFFF",
		"text-decoration":"underline"
	}); 
});

//Mouse out buttons in a result
$(document).on("mouseout", ".result-button", function(){
	$(this).children().css({
		"color":"gray",
		"text-decoration":"none"
	});
})

//Click on buttons in a result
$(document).on("mousedown", ".result-button", function(){
	$(this).children().css("color", "#0099CC");
});

//Click up buttons in a result
$(document).on("mouseup", ".result-button", function(){
	$(this).children().css("color", "#00BFFF");	
});





//Admin clicking on 'Edit', 'Remove', 'Save', 'Cancle'

var values = [];
var editing = -1;
var num_elements = 0;
$(document).on("click", ".result-button", function(e){ //Click on 'Edit', 'Remove', 'Save', or 'Cancel'
	e.preventDefault();
	//If the button clicked is not in the result currently being edited
	if(editing != -1){ 		
		$(this).parents("div").each(function(){
			if($(this).hasClass("search-result")){
				//Traverse to parent search-result 'div'
				if($(this).index() != editing){
					//Click the Cancel button in the search-result currently being edited
					$("#all-search-results-div").children().eq(editing).find(".result-buttons").children().eq(1).click();
				}
			}
		});
	}
	if($(this).children().html() == "Remove" && editing == -1){
		$(this).parents("div").each(function(){
			if($(this).hasClass("search-result")){
				var result = $(this);
				var index = $(this).children('.result-id').val();
				$.ajax({
					url: 'http://localhost:3000/pieces/' + index,
					method: 'DELETE',
					statusCode: {
						204: function(){
							console.log('Successfully deleted');
							result.remove();
							return false;
						},
						404: function(){
							console.log('Entry could not be found in database');
						},
						500: function(){
							console.log('Internal server error');
						}
					}
				});
			}
		});
	}
	else if($(this).children().html() == "Edit"){
		$(this).children().html("Save");
		$(this).parent().children().eq(1).children().html("Cancel");
		$(this).parents("div").each(function(){
			if($(this).hasClass("search-result")){
				editing = $(this).index();
				var height = $(this).height();
				$(this).children().eq(0).removeAttr('disabled');	
				for(var data = 1; data < 5; data++){
					var text = $(this).children().eq(data).children().html();
					values.push(text);
					if(data == 1){
						$(this).children().eq(data).css("padding", 0);
						$(this).children().eq(data).children().replaceWith("<textarea  class='data-input title-input' style='height: " + height + "px; resize: none'>" + text + "</textarea>");
					}
					if(data == 2){
						$(this).children().eq(data).css("padding", 0);
						$(this).children().eq(data).children().replaceWith("<textarea  class='data-input artist-input' style='height: " + height + "px; resize: none'>" + text + "</textarea>");
					}
					if(data == 3){
						$(this).children().eq(data).css("padding", 0);
						$(this).children().eq(data).children().replaceWith("<textarea  class='data-input facility-input' style='height: " + height + "px; resize: none'>" + text + "</textarea>");
					}
					if(data == 4){
						$(this).children().eq(data).css("padding", 0);
						$(this).children().eq(data).children().replaceWith("<textarea  class='data-input location-input' style='height: " + height + "px; resize: none'>" + text + "</textarea>");
					}
				}
				return false;
			}
		});
	}
	else if($(this).children().html() == "Save"){
		editing = -1;
		$(this).children().html("Edit");
		$(this).parent().children().eq(1).children().html("Remove");
		$(this).parents("div").each(function(){
			if($(this).hasClass("search-result")){
				
				var new_title = $(this).children().eq(1).children().val();
				var new_artist = $(this).children().eq(2).children().val();
				var new_facility = $(this).children().eq(3).children().val();
				var new_loc = $(this).children().eq(4).children().val();

				$(this).children().eq(0).attr('disabled', 'true');

				var index = $(this).children('.result-id').val();

				var active_filter = $('.active');

				var updated_piece = {
					title: new_title,
					artist: new_artist,
					facility: new_facility,
					location: new_loc,
					filter: filters[$('.filter').index(active_filter)],
					order: order[(getRotationDegrees($('.active')) / 180) % 2]
				};
				if($(this).children().eq(0).is(':checked')){
					updated_piece.piece_crit = updated_piece.artist_crit = true;
				}

				$.ajax({
					url: 'http://localhost:3000/pieces/' + index,
					method: 'PUT',
					data: JSON.stringify(updated_piece),
					contentType: 'application/json',
					statusCode: {
						500: function(){
							console.log('Server error');
						},
						404: function(){
							console.log('Not found');
						}
					},
					success: function(piecesArray, textStatus, jqXHR){
						$("#all-search-results-div").empty();
						console.log(piecesArray);
						piecesArray.forEach(function(piece){
							createNew(piece.title, piece.artist, piece.facility, piece.location, piece.id, piece.piece_crit);
						});
						values = [];
						var max = 0;
						$(this).children(".data-wrapper").each(function(){
							if($(this).height() > max){
								max = $(this).height();
							}
						});

						$(this).children().each(function(){
							var difference = max - $(this).height();
							var padding = difference / 2;
							$(this).css("padding", padding + "px 0");
						});
					}
				});

				return false;
			}
		});
	}
	else{ //Click on 'Cancel'
		editing = -1;
		$(this).parents("div").each(function(){
			if($(this).hasClass("search-result")){
				$(this).children().eq(0).attr('disabled', 'true');
				for(var data = 1; data < 5; data++){
					if(data == 1){
						$(this).children().eq(data).children().replaceWith("<p class='search-result-data title-p'>" + values[data - 1] + "</p>");
					}
					if(data == 2){
						$(this).children().eq(data).children().replaceWith("<p class='search-result-data artist-p'>" + values[data - 1] + "</p>");
					}
					if(data == 3){
						$(this).children().eq(data).children().replaceWith("<p class='search-result-data institution-p'>" + values[data - 1] + "</p>");
					}
					if(data == 4){
						$(this).children().eq(data).children().replaceWith("<p class='search-result-data location-p'>" + values[data - 1] + "</p>");
					}
				}
				values = [];
				var max = 0;
				$(this).children(".data-wrapper").each(function(){
					if($(this).height() > max){
						max = $(this).height();
					}
				});

				$(this).children().each(function(){
					var difference = max - $(this).height();
					var padding = difference / 2;
					$(this).css("padding", padding + "px 0");
				});
				return false;
			}
		});
		$(this).children().html("Remove");	
		$(this).parent().children().eq(0).children().html("Edit");
	}
});







