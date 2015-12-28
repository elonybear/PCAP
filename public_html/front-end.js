// Change/flip active filter
var active = 0;
var flip = [0, 0, 0, 0, 0];
$(".filter").click(function(e){
	e.preventDefault();
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
	var active_filter;
	var url = 'http://localhost:3000/admin/pieces?filter=';
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
	url += filters[$(this).index()] + '&order=' + order[(flip[$(this).index()] / 180) % 2];
	console.log(url);
	$.ajax({
		url: url,
		methods: 'GET',
		statusCode: {
			500: function(){
				console.log('Server error');
			}
		},
		success: function(piecesArray, textStatus, jqXHR){
			$("#all-search-results-div").empty();
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
		}
	});	
});
