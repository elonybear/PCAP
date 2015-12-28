var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js')
var bcrypt = require('bcrypt');
var crypto = require('crypto-js');
var storage = require('node-persist');

var app = express();
var PORT = 3000;
var masterPassword = crypto.SHA256('hello').toString();
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public_html'));
storage.initSync();

function initializePassword(){
	var login = {
		username: 'admin',
		password: 'hello'
	};
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
	db.piece.findAll({
		where: {
			artist_upper: new_piece.artist_upper
		}
	}).then(function(pieces){
		console.log(JSON.stringify(pieces));
		pieces.forEach(function(piece){
			new_piece.artist_crit = piece.artist_crit;
		});
		db.piece.create(new_piece).then(function(piece){
			db.piece.findAll({
				order: order
			}).then(function(pieces){
				res.status(200).json(pieces);
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
				db.piece.findAll({
					order: order
				}).then(function(pieces){
					res.json(pieces);
				});
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
	var bytes = crypto.AES.decrypt(encryptedLogin, masterPassword);
	login = JSON.parse(bytes.toString(crypto.enc.Utf8));
	if(login.username === body.username && login.password === body.password){
		res.status(200).send('Login successful');
	}	
	else{
		res.status(401).send();
	}
});


db.sequelize.sync({force: true}).then(function(){
	app.listen(PORT, function(){
		initializePassword();
		console.log('Listening on port ' + PORT);
	});
});
