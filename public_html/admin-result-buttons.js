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
var editing = {
	index: -1,
	parent: 'left-column'
};
var num_elements = 0;
$(document).on("click", ".result-button", function(e){ //Click on 'Edit', 'Remove', 'Save', or 'Cancel'
	e.preventDefault();
	//If the button clicked is not in the result currently being edited
	console.log(editing.parent);
	console.log(editing.index);
	if(editing.index != -1){ 		
		$(this).parents("div").each(function(){
			if($(this).hasClass("search-result")){
				//Traverse to parent search-result 'div'
				if($(this).index() / 2 != editing.index || $(this).parent().attr('id') != editing.parent){
					//Click the Cancel button in the search-result currently being edited
					$('#' + editing.parent).children().eq(editing.index).find(".result-buttons").children().eq(1).click();
					editing.index = -1;
				}
			}
		});
	}
	if($(this).children().html() == "Remove" && editing.index == -1){
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
							if(result.parent().attr('id') === 'left-column'){
								console.log('Deleting in left column');
								if($('#left-column').children().length === 
								   $('#right-column').children().length){
									$('#left-column').append($('#right-column').children().first());
									$('#left-column').append($('#right-column').children().first());
									if($('#left-column').children().length > 2){
										console.log('removing first class');
										$('#left-column').find('.search-result').last().removeClass('first');
									}
									if($('#right-column').children().length > 0){
										$('#right-column').children().first().addClass('first');
									}
								}	
							}
							else{
								console.log('Deleting in right column');
								if($('#right-column').children().length < 
								   $('#left-column').children().length){
									   $('#right-column').children().first().removeClass('first');
									   $('#right-column').prepend($('#left-column').children().last());
									   $('#right-column').prepend($('#left-column').children().last());
									   $('#right-column').children().first().addClass('first');
								   }		
							}
							result.next().remove();
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
				editing.index = $(this).index() / 2;
				editing.parent = $(this).parent().attr('id');
				var height = $(this).height();	
				var title;
				var artist; 
				var institution;
				var location; 
				for(var data = 0; data < 4; data++){
					if(data == 0){
						title = $(this).find('.title-p');
						values.push(title.html());
					}
					if(data == 1){
						artist = $(this).find('.artist-p');
						values.push(artist.html());
					}
					if(data == 2){
						institution = $(this).find('.institution-p');
						values.push(institution.html());
					}
					if(data == 3){
						location = $(this).find('.location-p');
						values.push(location.html());
					}
				}
				title.replaceWith("<textarea class='data-input title-input' placeholder='New title' style='height:" + title.height() + "px;'>" + title.html() + "</textarea>");
				artist.replaceWith("<textarea class='data-input artist-input' placeholder='Artist name' artist-input' style='height:" + artist.height() + "px;'>" + artist.html() + "</textarea>");
				institution.replaceWith("<textarea class='data-input institution-input' placeholder='Facility name' institution-input' style='height:" + institution.height() + "px;'>" + institution.html() + "</textarea>");
				location.replaceWith("<textarea class='data-input location-input' placeholder='Display location' style='height:" + location.height() + "px;'>" + location.html() + "</textarea>");
				$(this).next().css('height', '30px');
				return false;
			}
		});
	}
	else if($(this).children().html() == "Save"){
		$(this).children().html("Edit");
		$(this).parent().children().eq(1).children().html("Remove");
		$(this).parents("div").each(function(){
			if($(this).hasClass("search-result")){
				var result = $(this);	
				var new_title = $(this).find('.title-input');
				var new_artist = $(this).find('.artist-input');
				var new_facility = $(this).find('.institution-input');
				var new_loc = $(this).find('.location-input');

				var index = $(this).children('.result-id').val();

				var active_filter = $('.active');

				var updated_piece = {
					title: new_title.val(),
					artist: new_artist.val(),
					facility: new_facility.val(),
					location: new_loc.val(),
					filter: filters[$('.filter').index(active_filter)],
					order: order[(getRotationDegrees($('.active')) / 180) % 2]
				};
				if($(this).next().children('input').is(':checked')){
					updated_piece.piece_crit = updated_piece.artist_crit = true;
				}
				else{
					updated_piece.piece_crit  = false;	
				}

				console.log(updated_piece);

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
						},
						204: function(){
							result.find('.title-input').replaceWith("<p class='search-result-data title-p'>" + new_title.val() + "</p>");
							result.find('.artist-input').replaceWith("<p class='search-result-data artist-p'>" + new_artist.val() + "</p>");
							result.find('.institution-input').replaceWith("<p class='search-result-data institution-p'>" + new_facility.val() + "</p>");
							result.find('.location-input').replaceWith("<p class='search-result-data location-p'>" + new_loc.val() + "</p>");
							result.next().css('height', '0px');
							editing.index = -1;
						},
						200: function(){
							var url = 'http://localhost:3000/admin.html?filter=' + $('.active').find('p').html().toLowerCase() + '&degree=' + getRotationDegrees($('.active'));
							console.log(url);
							window.location.href = url;
							editing.index = -1;
						}
					},
				});

				return false;
			}
		});
	}
	else{ //Click on 'Cancel'
		editing.index = -1;
		$(this).parents("div").each(function(){
			if($(this).hasClass("search-result")){
				$(this).find('.title-input').replaceWith("<p class='search-result-data title-p'>" + values[0] + "</p>");
				$(this).find('.artist-input').replaceWith("<p class='search-result-data artist-p'>" + values[1] + "</p>");
				$(this).find('.institution-input').replaceWith("<p class='search-result-data institution-p'>" + values[2] + "</p>");
				$(this).find('.location-input').replaceWith("<p class='search-result-data location-p'>" + values[3] + "</p>");
				values = [];
				$(this).next().css('height', '0px');
				return false;
			}
		});
		$(this).children().html("Remove");	
		$(this).parent().children().eq(0).children().html("Edit");
	}
});







