$(document).ready(function(){
		$("#login-overlay").css("top", 0);
		$("#wrapper").addClass("blur-filter");		
		$("#username").focus();	
});

$("#login-button-a").click(function(e){
	e.preventDefault();
	if($("#login-window-wrapper").css("opacity") != .9){
		$("#login-window-wrapper").animate({
			"top":"50%",
			"margin-top":"-175px",
			"opacity":".9"
		}, 500, "swing");
		$("#wrapper").addClass("blur-filter");		
		$("#username").focus();
	}
	else{
		e.stopPropagation();	
	}
});

function hideLoginMenu(){	
	$("#login-overlay").css("top","-750px");
	$("#wrapper").removeClass("blur-filter");
	$("#username").css("box-shadow", "none");
	$("#password").css("box-shadow", "none");
	$("#username").val("");
	$("#password").val("");
	$("#login-error-message").css("visibility", "hidden");
}

$("#x-login-a").click(function(e){
	e.preventDefault();
	window.location = "search-results-user.html";
});

var count = 0;
$("#submit-login").click(function (e) {
	e.preventDefault();
	if($("#username").val() == "admin" && $("#password").val() == "hello"){	
		count = 0;
		hideLoginMenu();
	}
	else{
		count++;
		$("#password").val("");
		$("#login-error-message").fadeIn(200).delay(500).fadeOut(2000);
	}
	if(count == 3){
		window.location = "search-results-user.html";	
	}
});

$(document).keypress(function(e) {
	if($("#login-window-wrapper").css("opacity") == .9){
		if(e.which == 13){
			$("#submit-login").click();
		}
	}
});
