var active = 0;
var flip = [0, 0, 0, 0];

$(".filter").click(function(e){
	e.preventDefault();
	if(!$(this).hasClass("active")){
		//Inactive filter clicked
	
		//Removing active class from previously active filter
		var old_active = $("#filter-buttons").children().eq(active);
		old_active.switchClass("active", "inactive");
		old_active.find("img").addClass("inactive-triangle");				

		//Adding active class to clicked filter
		$(this).switchClass("inactive", "active");
		active = $(".filter").index(this);
		$(this).find("img").removeClass("inactive-triangle");
	}
	else{
		//Active filter clicked
		
		//Rotate triangle by 180 degrees	
		flip[active] += 180;
		$(this).find("img").css("transform",  "rotate(" + flip[active] + "deg)");
	}	
});


$(".result-button").hover(function(){
	$(this).children().css({
		"color":"#00BFFF",
		"text-decoration":"underline"
	});
}, function(){
	$(this).children().css({
		"color":"gray",
		"text-decoration":"none"
	});
});

$(".result-button").mousedown(function(){
	$(this).children().css("color", "#0099CC");
});

$(".result-button").mouseup(function(){
	$(this).children().css("color", "#00BFFF");	
});


var values = [];
var editing = -1;
$(".result-button").click(function(e){ //Click on 'Edit', 'Remove', 'Save', or 'Cancel'
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
	if($(this).children().html() == "Remove"){
		$(this).parents("div").each(function(){
			if($(this).hasClass("search-result")){
				$(this).remove();
				return false;
			}
		});
	}
	else if($(this).children().html() == "Edit"){
		$(this).children().html("Save");
		$(this).parent().children().eq(1).children().html("Cancel");
		$(this).parents("div").each(function(){
			if($(this).hasClass("search-result")){
				editing = $(this).index();
				for(var data = 0; data < 3; data++){
					var text = $(this).children().eq(data).children().html();
					values.push(text);
					if(data == 0){
						$(this).children().eq(data).children().replaceWith("<input type ='text' class='data-input title-input' value='" + text + "'>");
					}
					if(data == 1){
						$(this).children().eq(data).css("padding", 0);
						$(this).children().eq(data).children().replaceWith("<input type ='text' class='data-input artist-input' value='" + text + "'>");
					}
					if(data == 2){
						$(this).children().eq(data).css("padding", 0);
						$(this).children().eq(data).children().replaceWith("<input type ='text' class='data-input institution-input' value='" + text + "'>");
					}
				}
				return false;
			}
		});
	}
	else if($(this).children().html() == "Save"){
		var index = 0;
		editing = -1;
		$(this).children().html("Edit");
		$(this).parent().children().eq(1).children().html("Remove");
		$(this).parents("div").each(function(){
			if($(this).hasClass("search-result")){
				index = $(this).index();
				for(var data = 0; data < 3; data++){
					if(data == 0){
						$(this).children().eq(data).children().replaceWith("<p class='search-result-data title-p'>" + $(this).children().eq(data).children().val() + "</p>");
					}
					if(data == 1){
						$(this).children().eq(data).css("padding", "9px 0");
						$(this).children().eq(data).children().replaceWith("<p class='search-result-data artist-p'>" + $(this).children().eq(data).children().val() + "</p>");
					}
					if(data == 2){
						$(this).children().eq(data).css("padding", "9px 0");
						$(this).children().eq(data).children().replaceWith("<p class='search-result-data institution-p'>" + $(this).children().eq(data).children().val() + "</p>");
					}
				}
				values = [];
				return false;
			}
		});
		/*if(index % 2){
			var difference = $("#all-search-results-div").children().eq(index - 1).height() - $("#all-search-results-div").children().eq(index).height();
			if(difference > 0){
				var artist_p = $("#all-search-results-div").children().eq(index).children().eq(0).children().eq(1);
				var artist_margin = parseInt(artist_p.css("margin-top").replace("px", ""));
				artist_p.css("margin-top", artist_margin + difference + "px");
			}
			else if(difference < 0){
				var artist_p = $("#all-search-results-div").children().eq(index - 1).children().eq(0).children().eq(1);
				var artist_margin = parseInt(artist_p.css("margin-top").replace("px", ""));
				artist_p.css("margin-top", artist_margin - difference + "px");	
			}
		} 
		else{

		}
		index = 0;*/
	}
	else{ //Click on 'Cancel'
		editing = -1;
		$(this).children().html("Remove");	
		$(this).parent().children().eq(0).children().html("Edit");
		$(this).parents("div").each(function(){
			if($(this).hasClass("search-result")){
				for(var data = 0; data < 3; data++){
					if(data == 0){
						$(this).children().eq(data).children().replaceWith("<p class='search-result-data title-p'>" + values[data] + "</p>");
					}
					if(data == 1){
						$(this).children().eq(data).css("padding", "9px 0");
						$(this).children().eq(data).children().replaceWith("<p class='search-result-data artist-p'>" + values[data] + "</p>");
					}
					if(data == 2){
						$(this).children().eq(data).css("padding", "9px 0");
						$(this).children().eq(data).children().replaceWith("<p class='search-result-data institution-p'>" + values[data] + "</p>");
					}
				}
				values = [];
				return false;
			}
		});
	}
});
