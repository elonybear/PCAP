var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js')
var bcrypt = require('bcrypt');
var crypto = require('crypto-js');
var storage = require('node-persist');
var jsdiff = require('diff');
var GoogleSpreadsheet = require('google-spreadsheet');

var app = express();
var PORT = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public_html'));
storage.initSync();

var argv = require('yargs')
	.options('force', {
		force: {
			demand: true,
			alias: 'f',
			description: 'clear the database',
			type: 'string'
		}	
	}).argv;

var force = argv.f;

function initializePassword(){
	var login = {
		username: 'admin',
		password: 'hello'
	};
	var masterPassword = crypto.SHA256(login.password).toString();
	var encryptedLogin = crypto.AES.encrypt(JSON.stringify(login), masterPassword);
	storage.setItemSync('login', encryptedLogin.toString());
}

//Get /admin/pieces on load for admin
app.get('/admin/pieces', function(req, res){
	var query = req.query;
	var order = query.filter + ' ' +  query.order;
	db.piece.findAll({
		order: order
	}).then(function(pieces){
		res.json(pieces);
	}, function(e){
		res.status(500).send(e);
	});
});

//Get /user/pieces on load for user
app.get('/user/pieces', function(req, res){
	var query = req.query;
	var order = query.filter + ' ' + query.order;
	console.log(order);
	db.piece.findAndCountAll({
		where: {
			artist_crit: false
		},
		order: order
	}).then(function(noArtistCrit){
		if(noArtistCrit.count === 0){
			db.piece.findAll({
				where: {
					piece_crit: false
				},
				order: order
			}).then(function(noPieceCrit){
				res.json(noPieceCrit);
			})
		} else {
			res.json(noArtistCrit.rows);	
		}
	}, function(e){
		res.status(500).send(e);
	});
});

//Get /search?user=user&q=
app.get('/search', function(req, res){
	var query = req.query;
	var where = {};
	var order = query.filter + ' ' + query.order;
	if(query.hasOwnProperty('q') && query.q.length > 0){
		var q_upper = query.q.toUpperCase();
		where = { 
			$or: [{
				title_upper: {
					$like: '%' + q_upper + '%'
				}},
				{  artist_upper: {
					$like: '%' + q_upper + '%'
				}
			}]	
		}
	}	
	if(query.hasOwnProperty('user') && query.user === 'user'){
		where.artist_crit = false;	
	}

	db.piece.findAll({
		where: where,
		order: order
	}).then(function(pieces){
		var max_rows = storage.getItemSync('max_rows');
		res.json(pieces);	
	}, function(e){
		res.status(500).send(e);
	});
});

app.post('/upload', function(req, res){
	console.log('Received file upload request');
	var doc = new GoogleSpreadsheet('1G0knhyWWjhSumNIQMfOJMYK1q911v-4aW2SbsdDl3vM');
	var creds = {
		client_email: 'pcap-1251@appspot.gserviceaccount.com',
		private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCsM2x1PcKqsC/K\nvFV/1HMCPpOUu/hcYd+F3haBR+7Rx7jkVsjEdZduk/7lqnzdFy1drKsrGpmZCHjB\n6bnFMWdTVHySb9qswHjZ6M3FrQVhT4uLkPC6gwczvpxdTNLQHrsMeg0zjMv3dVPb\nZDRQ0Sy43B828r3L+UDm8kKz/pmJ5WlaKOH4NFfWmo5CVwdZj1nxWZiDNil3WTKG\nSQdzY7n7BDpqnrxEqQWgsCZe7KdUEViGxMa38AIcYzO1CW57BrHYo5B2dJD1aV86\n0rp1uFjOkdEXiJvnSmX95djCRBvUIC1rHdxOZaSFxU+AfWHEQV9J6UI8Y9q+/nx3\ngLEy13nlAgMBAAECggEAdiBMjVyRln+IOV3alPcK8gY1PPl5FP561B0WeRb8R+Hm\n/pRd4w77k3poh+nc/9lvYGwbe1Ui+qyqEfOgYRpT1AEH93hNnOXnwSwHREw9fZSQ\nmGwUBw3tOdzO7N3PW79I9vUe6zbxkE5m+QATN0FWmXU+4HXCJxNUJ1kW0tybPNEH\nhYPFCJ80Ch1Syq1odwao8L+mm76U3oUz5BruvQc+1LUccZP00ld/5meZ4QsKyAPP\ndfQukSIn/mW3GRPDwQ5BwKrKA0wjAz7He5V1Ff5gwZDtQR8s63QcOkl+KBcKZOGs\nd+qMirLaYBI6SPX0lKI2FDRTeheZJWEqUY7KXw6cvQKBgQDb+EjDAXud6xBnykPS\n5TE3h2Ny3rfatHRyCkgjxvxbnPt9DF6LTQ2OI23QYGSyjOJIwwjja4AsNYu8C92k\n6v28U1OI20t5ZIRdqXlZcf7DDzO4BK41yIdbH+lDfH0JO9vO0MmXC5D7nUfSwZmk\npaFiw6qcom59Cx6Ii70w7AT8wwKBgQDIaBp5K82DMhz00fbuhpVKNwcutKcfAhDo\nuXagT0u/CNdy4HAcy9PT7nzvRUQ5HYppuwvicsXNWH8YI74GP4XWOaM4UhKr9UOV\ntZrzeFv4ugimXHBBoJeqNCBaM7PkMTAbbGj2DTAX3knH3rDp7MoTKaWbnepkRiYk\nkbaBzENkNwKBgQCkaFtB3R7eti1p1cSBoSn6/ec3mP1DqrKJ9eNbUkOV2awiF5em\neC3Ueeh+4T0CMsiCZ7uB9vwyjsblAt1jgPuqwYDi/jzX+2fvdVasosYuVnNqa50l\nt75rPlujRC1UNHgiiOzTRyLS3QgsnuTOKbmIzwP61HDOZvwoRIFgSlej7wKBgGsQ\nUrRRVmW0rAuO8GDVvYP8ifXFxVKng+kQy/Mw6cKRMqjIhpybt/sM+enKE3x/76Y0\nq1C7CDmAAcYfsjEcVp/wAubf0eHUEds1Pia8MkZa/KwDzmUBKoVfe7k0zfIm5RCB\nhkGNIhheRQRmUBVozzwVj8fnQYV4hIAc6GfHfGlZAoGASPkwPOruu+FvO/+GyWH6\nTBCrcSvEUBf7GhY3oPmUGYY/N9jCF+21/j1w/rmXbzPAku6XbKSUxd4tZFmttGcJ\nkXrzLLZyN4f5g/08viKs/c5K5Xg3nnI2x+1Gb6kPQtfGAaHfFOD0RMJ5lMEzFt/f\nA+lQpP9n2rGIxAf3ocz89xY=\n-----END PRIVATE KEY-----\n'
	};
	doc.useServiceAccountAuth(creds, function(err){
		doc.getInfo( function(err, sheet_info){
			if(err){
				res.status(500);
			}
			else {
				console.log('success in reading file');
			}
			console.log(sheet_info.title + ' is loaded');
			console.log(sheet_info.worksheets.length);
			var num = 0;
			sheet_info.worksheets[0].getRows(function(err, rows){
				//rows.forEach(function(row){
				var body = _.pick(req.body, 'start', 'step');	
				console.log(body);
				for(var i = body.start; i < body.start + body.step; i++){
					var row = rows[i];
					if(row && row.artistnameforlabel){
						var new_piece = {
							title: row.title,
							title_upper: row.title.toUpperCase(),
							artist: row.artistnameforlabel,
							artist_upper: row.artistnameforlabel.toUpperCase(),
							location: '',
							location_upper: ''
						};
						if(!row.facilitywhenartworksubmitted){
							new_piece.facility = "";
							new_piece.facility_upper = "";
						}
						else {
							new_piece.facility = row.facilitywhenartworksubmitted;
							new_piece.facility_upper = row.facilitywhenartworksubmitted.toUpperCase();
						}
						console.log(i);
						db.piece.create(new_piece).then(function(piece){
						}, function(err){
							console.log(err);
							res.status(500).json(err);
						});
					}
				}
				res.status(204).send();
				//});
			});
		});
	});
});

app.post('/pieces', function(req, res){
	console.log('Received create request');
	var body = _.pick(req.body, 'title', 'artist', 'facility', 'location');	
	var order = req.body.filter + ' ' + req.body.order;
	var new_piece = {
		title: body.title,
		title_upper: body.title.toUpperCase(),
		artist: body.artist,
		artist_upper: body.artist.toUpperCase(),
		facility: body.facility,
		facility_upper: body.facility.toUpperCase()
	};
	console.log(new_piece.artist_upper);
	db.piece.findOne({
		where: {
			artist_upper: new_piece.artist_upper
		}
	}).then(function(piece){
		if(piece){
			new_piece.artist_crit = piece.artist_crit;
		}
		db.piece.create(new_piece).then(function(piece){
			db.piece.findAll({
				order: order
			}).then(function(pieces){
				var max_rows = storage.getItemSync('max_rows'); 	
				res.status(200).json({
					all_pieces: pieces,
					new_piece: piece,
					max_rows: max_rows
				});
			});
		}, function(e){
			console.log(e);
			res.status(500).json(e);
		});
	});
});

app.delete('/pieces/:id', function(req, res){
	var pieceId = parseInt(req.params.id, 10);
	db.piece.findOne({
		where: {
			id: pieceId
		}
	}).then(function(piece){
		if(piece){
			piece.destroy();
			res.status(204).send();
		} else{
			res.status(404).send();	
		}
	}, function(e){
		res.status(500).json(e);
	})	
});

app.delete('/all', function(req, res){
	var body = _.pick(req.body, 'username', 'password');
	var encryptedLogin = storage.getItemSync('login');
	var login;
	if(encryptedLogin){
		var masterPassword = crypto.SHA256(body.password).toString();
		try{
			var bytes = crypto.AES.decrypt(encryptedLogin, masterPassword);
			login = JSON.parse(bytes.toString(crypto.enc.Utf8));
			if(login.username === body.username && login.password === body.password){
				db.sequelize.sync({force: true}).then(function(){
					res.status(204).send();
					
				}, function(){
					res.status(500).send();
				});
			} else{
				res.status(401).send();
			}

		} catch(e){
			res.status(401).send();
		}
	} 
});

app.put('/critique/:id', function(req, res){ //User submits critique
	console.log('Received critique request');
	var pieceId = parseInt(req.params.id, 10);
	console.log(pieceId);
	var body = _.pick(req.body, 'name', 'email');
	var attributes = {
		crit_name: body.name,
		crit_email: body.email,
		piece_crit: true,
		artist_crit: true
	};

	db.piece.findOne({
		where: {
			id: pieceId
		}
	}).then(function(piece){
		if(piece){
			var critiqued = storage.getItemSync(piece.id);
			if(critiqued && critiqued == 'true'){
				res.status(409).send();
			}
			else {
				storage.setItemSync(piece.id, 'true');
			}
			piece.update(attributes).then(function(piece){
				db.piece.findAll({
					where: {
						artist_upper: piece.artist_upper
					}
				}).then(function(pieces){
					pieces.forEach(function(piece){
						piece.update({ artist_crit: true });
					});
				});
				res.status(200).json(piece);
			});
		}
	}).catch(function(e){
		res.status(500).json(e);
	});
});

app.put('/remove-critique/:id', function(req, res){
	var pieceId = parseInt(req.params.id, 10);
	console.log(pieceId);
	var attributes = {
		crit_name: "",
		crit_email: "",
		piece_crit: false
	}
	db.piece.findOne({
		where: {
			id: pieceId
		}
	}).then(function(piece){
		if(piece){
			storage.setItemSync(piece.id, 'false');
			piece.update(attributes).then(function(piece){
				db.piece.findAll({
					where: {
						artist_upper: piece.artist_upper
					}
				}).then(function(pieces){
					var critiqued = false;
					pieces.forEach(function(piece){
						if(piece.piece_crit === true){
							critiqued = true;
							return false;
						}
					});
					if(critiqued === false){
						pieces.forEach(function(piece){
							piece.update({artist_crit: false});
						})
					}
				});
				console.log('Sending 204');
				res.status(204).send();
			});
		}
	});
});

app.put('/pieces/:id', function(req, res){
	var pieceId = parseInt(req.params.id, 10);
	var body = _.pick(req.body, 'title', 'artist', 'facility', 'location', 'artist_crit', 'piece_crit');
	var order = req.body.filter + ' ' + req.body.order;
	var attributes = {};	

	if(body.hasOwnProperty('title')){
		attributes.title = body.title;
		attributes.title_upper = body.title.toUpperCase();
	}
	if(body.hasOwnProperty('artist')){
		attributes.artist = body.artist;
		attributes.artist_upper = body.artist.toUpperCase();
	}
	if(body.hasOwnProperty('facility')){
		attributes.facility = body.facility;
		attributes.facility_upper = body.facility.toUpperCase();
	}
	if(body.hasOwnProperty('location')){
		attributes.location = body.location;
		attributes.location_upper = body.location.toUpperCase();
	}
	if(body.hasOwnProperty('artist_crit')){
		attributes.artist_crit = body.artist_crit;
	}

	if(body.hasOwnProperty('piece_crit')){
		attributes.piece_crit = body.piece_crit;
	}

	console.log(attributes);
	console.log(pieceId);
	db.piece.findOne({
		where: {
			id: pieceId
		}
	}).then(function(piece){
		if(piece){
			var old_piece = piece;
			var differences = {};
			for(var key in old_piece.dataValues){
				if(attributes.hasOwnProperty(key) && old_piece[key] != attributes[key]){
					differences[key] = attributes[key];
				}
			}
			piece.update(attributes).then(function(piece){
				console.log("\nNew piece\n");
				console.log(piece);
				if(piece.piece_crit == true){
					db.piece.findAll({
						where: {
							artist_upper: piece.artist_upper
						}
					}).then(function(pieces){
						pieces.forEach(function(piece){
							piece.update({ artist_crit: true });
						});
					});
				}
				else{
					if(piece.crit_name != ""){
						piece.crit_name = "";
						piece.crit_email = "";
					}
					db.piece.findAll({
						where: {
							artist_upper: piece.artist_upper
						}
					}).then(function(pieces){
						var critiqued = false;
						pieces.forEach(function(piece){
							if(piece.piece_crit === true){
								critiqued = true;
								return false;
							}
						});
						if(critiqued === false){
							pieces.forEach(function(piece){
								piece.update({artist_crit: false});
							})
						}
					});
				}
				if(differences.hasOwnProperty(req.body.filter)){
					console.log('Sending 200');
					res.status(200).send();
				}
				else{
					console.log('Sending 204');
					res.status(204).send();
				}
			}).catch(function(e){
				res.status(500).json(e);	
			});
		} else {
			res.status(404).send();
		}
	}, function(e) {
		res.status(500).send(e);
	});
});


app.post('/login', function(req, res){
	console.log("Received login request");
	var body = _.pick(req.body, 'username', 'password');
	var login;
	var encryptedLogin = storage.getItemSync('login');
	if(encryptedLogin){
		var masterPassword = crypto.SHA256(body.password).toString();
		try{
			var bytes = crypto.AES.decrypt(encryptedLogin, masterPassword);
			login = JSON.parse(bytes.toString(crypto.enc.Utf8));
			if(login.username === body.username && login.password === body.password){
				storage.setItemSync('time', req.body.time);
				res.status(200).send('Login successful');
			} else{
				res.status(401).send();
			}

		} catch(e){
			res.status(401).send();
		}
	} else{
		res.status(404).send();
	}
});

app.post('/password', function(req, res){
	var body = _.pick(req.body, 'old_password', 'new_password');
	var new_login = {
		username: 'admin',
		password: body.new_password
	};
	var old_login;
	var encryptedLogin = storage.getItemSync('login');
	var masterPassword = crypto.SHA256(body.old_password).toString();
	var bytes = crypto.AES.decrypt(encryptedLogin, masterPassword);
	old_login = JSON.parse(bytes.toString(crypto.enc.Utf8));
	if(old_login.password === body.old_password){
		masterPassword = crypto.SHA256(new_login.password).toString();
		encryptedLogin = crypto.AES.encrypt(JSON.stringify(new_login), masterPassword);
		storage.setItemSync('login', encryptedLogin.toString());
	}
	res.status(204).send();	
});

/*app.post('/password_init', function(req, res){
	console.log('Setting new password');
	var new_login = {
		username: 'admin',
		password: 'hello'
	};
	var masterPassword = crypto.SHA256(new_login.password).toString();
	var encryptedLogin = crypto.AES.encrypt(JSON.stringify(new_login), masterPassword);
	storage.setItemSync('login', encryptedLogin.toString());
	res.status(204).send();	
});*/

app.get('/logout', function(req, res){
	storage.setItemSync('time', '0');		
	res.status(204).send();
});

//Get /time on load for admin
app.get('/time', function(req, res){
	var time = storage.getItemSync('time');
	if(time){
		console.log('Returning time: ' + time);
		res.status(200).json(time);
	}
	else{
		res.status(404).send();
	}
});

//POST /time on load for admin
app.post('/time', function(req, res){
	var body = _.pick(req.body, 'time');
	console.log('Setting time: ' + JSON.stringify(body));
	storage.setItemSync('time', body.time);
	res.status(204).send();
});

//POST /number on load
app.post('/number', function(req, res){
	var body = _.pick(req.body, 'max_rows');
	storage.setItemSync('max_rows', body.max_rows);
	res.status(204).send();
});

db.sequelize.sync({force: force === 'true'}).then(function(){
	if(force === 'true'){
		console.log('Server started with empty database');
	}
	else{
		console.log('Server importing existing database');
	}
	app.listen(PORT, function(){
		//initializePassword();
		console.log('Listening on port ' + PORT);
	});
});
