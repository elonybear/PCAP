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

		var url;
		if(location.hostname == "localhost"){
			url = "http://localhost:3000/upload";
		}
		else {
			url = "http://pcap-database.herokuapp.com/upload";
		}
		console.log("Posting");
		$.ajax({
			url: url,
			method: 'POST',
			statusCode : {
				200: function(){
					$("#update-database-x").click();
					loadEntries();
				}
			}
		});
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