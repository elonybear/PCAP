function showOverlay() {
	$("#wrapper").addClass("blur-filter");
	$("#overlay").fadeIn();
}

function hideOverlay() {
	$("#wrapper").removeClass("blur-filter");
	$("#overlay").fadeOut();
}

/* Click 'update database' button */
$("#update-database").click(
	function(event) {
		event.preventDefault();
		showOverlay();
		$("#update-wrapper").css("right", "50%");
	}
);

/* Click 'x' on 'update database' window */
$("#update-database-x").click(
	function(event) {
		event.preventDefault();
		hideOverlay();
		$("#update-wrapper").css("right", "-350px");
	}
);

$("#add-new-entry").click(
	function(event){
		event.preventDefault();
		$("#update-wrapper").css("right", "115%");
		$("#add-wrapper").css("right", "50%");
		setTimeout(function(){
			$("#add-arrow").fadeIn();
		}, 750, "slow");
	}
);

$("#add-arrow").click(
	function(event){
		event.preventDefault();
		$("#update-wrapper").css("right", "50%");
		$("#add-wrapper").css("right", "-400px");
		$("#add-arrow").fadeOut();
	}
);

$("#upload").click(
	function(event){
		event.preventDefault();
		$("#update-wrapper").css("right", "-350px");
		$("#progress-bar-div").fadeIn();
		var url;
		if(location.hostname == "localhost"){
			url = "http://localhost:3000/upload";
		}
		else {
			url = "http://pcap.herokuapp.com/upload";
		}
		console.log("Posting");
		var max = 615;
		var step = 15;
		var num;
		var recur_load = function(i){
			num = i || 0;
			if(num < max / step){
				$.ajax({
					url: url,
					method: 'POST',
					data: JSON.stringify({
						start: num*step,
						step: step
					}),
					contentType: 'application/json',
					statusCode : {
						204: function(){
							$("#progress-bar").css("width", $("#progress-bar").width() + step + "px");
							console.log(num);
							recur_load(num + 1);
							if(num == max / step){
								$("#progress-bar-container, .loading").fadeOut();
								$("#progress-bar-div p").fadeIn(1000);
								$("#progress-bar-div").animate({
									width: "152px",
									marginLeft: "-75px"
								}, 1000);
								setTimeout(function(){
									$("#progress-bar-div").fadeOut("slow", function(){
										hideOverlay();
										loadEntries();
									});
								}, 2000);
							}
						}
					}
				});
			}
		}
		recur_load(0);
	}
);

$("#clear-database").click(
	function(event){
		event.preventDefault();
		$("#update-wrapper").css("right", "115%");
		$("#clear-wrapper").css("right", "50%");
		setTimeout(function(){
			$("#clear-arrow").fadeIn();
		}, 750, "slow");
	}
);

$("#clear-arrow").click(
	function(event){
		event.preventDefault();
		$("#update-wrapper").css("right", "50%");
		$("#clear-wrapper").css("right", "-400px");
		$("#clear-arrow").fadeOut();
	}
);