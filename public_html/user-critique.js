$(document).on('click', '.title-link', function(event){
	event.preventDefault();
	var critique_box;
	$(this).parents("div").each(function(){
		if($(this).hasClass("search-result")){
			console.log($(this));
			critique_box = $(this).next();
		}
	});

	if(critique_box.height() == 0){
		critique_box.css("height", "40px");
	}
	else {
		critique_box.css("height", "0px");
		critique_box.children("input").val("");
	}
});

$(document).on('click', '.user-critique-submit', function(event){
	event.preventDefault();
	var username = $(this).siblings().first();
	var useremail = $(this).siblings().last();
	var empty = false;
	if(username.val() == ""){
		username.css("background-color", "#FFD4D4");
		console.log("Empty username");
		empty = true;
	}
	else if(username.val() != ""){
		username.css("background-color", "white");
	}
	if(!isValidEmailAddress(useremail.val())){
		useremail.css("background-color", "#FFD4D4");
		empty = true;
		console.log("Invalid or empty email address");
	}
	else {
		useremail.css("background-color", "white");
	}
	if(empty) return false;
	var critique = {
		name: username.val(),
		email: useremail.val()
	};
	$(this).siblings().val("");
	$(this).parent().css("height", "0px");
	var url;
	if(location.hostname == "localhost"){
		url = "http://localhost:3000/critique/";
	}
	else {
		url = "http://pcap-database.herokuapp.com/critique/";
	}
	var id = $(this).parent().prev().children('.result-id').val();
	$.ajax({
		url: url + id,
		method: 'PUT',
		data: JSON.stringify(critique),
		contentType: 'application/json',
		statusCode: {
			500: function(){
				console.log("Could not set critique");
				location.reload();
			},
			200: location.reload()
		}
	});
});

function isValidEmailAddress(emailAddress) {
    var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    return pattern.test(emailAddress);
};