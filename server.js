var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js')
var bcrypt = require('bcrypt');
var crypto = require('crypto-js');
var storage = require('node-persist');
var jsdiff = require('diff');

var app = express();
var PORT = 3000;
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
		where = { 
			$or: [{
				title: {
					$like: '%' + query.q + '%'
				}},
				{  artist: {
					$like: '%' + query.q + '%'
				}},
				{  facility: {
					$like: '%' + query.q + '%'
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
		facility_upper: body.facility.toUpperCase(),
		location: body.location,
		location_upper: body.location.toUpperCase(),
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

	db.piece.findOne({
		where: {
			id: pieceId
		}
	}).then(function(piece){
		if(piece){
			var old_piece = piece;
			var differences = {};
			for(var key in piece.dataValues){
				if(piece[key] != attributes[key]){
					differences[key] = attributes[key];
				}
			}
			piece.update(attributes).then(function(piece){
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
					db.piece.findAll({
						where: {
							artist_upper: piece.artist_upper
						}
					}).then(function(pieces){
						var critiqued = false;
						pieces.forEach(function(piece){
							if(piece.piece_crit === true){
								critiqued = true;
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
