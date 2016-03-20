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
					$('#' + editing.parent).children().eq(editing.index * 2).find(".result-buttons").children().eq(1).click();
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
				var url;
				if(location.hostname == 'localhost') {
					url = 'http://localhost:3000/pieces/';
				}
				else {
					url = 'http://pcap.herokuapp.com/pieces/';
				}
				$.ajax({
					url: url + index,
					method: 'DELETE',
					statusCode: {
						204: function(){
							location.reload();
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
				var old_height = $(this).height();
				var critique_info = $(this).find('.critique-info');
				editing.index = $(this).index() / 2;
				editing.parent = $(this).parent().attr('id');
				var height = $(this).height();	
				var title;
				var artist; 
				var location; 
				for(var data = 0; data < 3; data++){
					if(data == 0){
						title = $(this).find('.title-p');
						values.push(title.html());
					}
					if(data == 1){
						artist = $(this).find('.artist-p');
						values.push(artist.html());
					}
					if(data == 2){
						location = $(this).find('.location-p');
						values.push(location.html());
					}
				}
				title.replaceWith("<textarea class='data-input title-input' placeholder='New title' style='height:" + title.height() + "px;'>" + title.html() + "</textarea>");
				artist.replaceWith("<textarea class='data-input artist-input' placeholder='Artist name' artist-input' style='height:" + artist.height() + "px;'>" + artist.html() + "</textarea>");
				location.replaceWith("<textarea class='data-input location-input' placeholder='Display location' style='height:" + location.height() + "px;'>" + location.html() + "</textarea>");
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
				var new_loc = $(this).find('.location-input');
				var old_height = result.height();

				var index = $(this).children('.result-id').val();

				var active_filter = $('.active');

				var updated_piece = {
					title: new_title.val(),
					artist: new_artist.val(),
					location: new_loc.val(),
					filter: filters[$('.filter').index(active_filter)],
					order: order[(getRotationDegrees($('.active')) / 180) % 2]
				};

				console.log(updated_piece);
				var url;
				if(location.hostname == 'localhost') {
					url = 'http://localhost:3000/pieces/';
				}
				else {
					url = 'http://pcap.herokuapp.com/pieces/';
				}
				$.ajax({
					url: url + index,
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
							result.find('.location-input').replaceWith("<p class='search-result-data location-p'>" + new_loc.val() + "</p>");
							editing.index = -1;
						},
						200: function(){
							var url_reload;
							if(location.hostname == "localhost"){
								url_reload = 'http://localhost:3000/admin.html?filter=';
							}
							else {
								url_reload = 'http://pcap-database.herokuapp.com/admin.html?filter='
							}
							url_reload += $('.active').find('p').html().toLowerCase() + '&degree=' + getRotationDegrees($('.active'));
							console.log(url);
							editing.index = -1;
							window.location.href = url;
						}
					},
				});

				return false;
			}
		});
	}
	else if($(this).children().html() == "Cancel"){ //Click on 'Cancel'
		editing.index = -1;
		$(this).parents("div").each(function(){
			if($(this).hasClass("search-result")){
				$(this).find('.title-input').replaceWith("<p class='search-result-data title-p'>" + values[0] + "</p>");
				$(this).find('.artist-input').replaceWith("<p class='search-result-data artist-p'>" + values[1] + "</p>");
				$(this).find('.location-input').replaceWith("<p class='search-result-data location-p'>" + values[2] + "</p>");
				values = [];
				return false;
			}
		});
		$(this).children().html("Remove");	
		$(this).parent().children().eq(0).children().html("Edit");
	}
	else { //Click on Cancel Critique
		$(this).parents("div").each(function(){
			if($(this).hasClass("search-result")){
				var result = $(this);
				var index = $(this).children('.result-id').val();
				var url;
				if(location.hostname == "localhost"){
					url = "http://localhost:3000/remove-critique/";
				}
				else {
					url = "http://pcap.herokuapp.com/remove-critique/";
				}
				$.ajax({
					url: url + index,
					method: 'PUT',
					statusCode : {
						500: function(){
							console.log('Server error');
						},
						404: function(){
							console.log('Not found');
						},
						204: function(){
							console.log('Critique removed');
							result.removeClass('critiqued');
							result.addClass('uncritiqued');
							result.find('.critique-info').css('display', 'none');
							result.find('.critique-info').find('.critique-name-p').text("");
							result.find('.critique-info').find('.critique-email-p').text("");
							result.find('.cancel-critique').css('display', 'none');
						}
					}
				})
			}
		});
	}
});







