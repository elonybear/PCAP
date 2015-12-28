var Sequelize = require('sequelize');

var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/data/pcap-db.sqlite'
});

var db = {};

db.piece = sequelize.import(__dirname + '/models/piece.js');

db.sequelize = sequelize;
db.Sequelize = Sequelize;

//Set artist-piece associations
//Many pieces associated with one artist
//One artist associated with many pieces
module.exports = db;
