var Sequelize = require('sequelize');

var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/data/pcap-db.sqlite'
});

var db = {};

db.piece = sequelize.import(__dirname + '/models/piece.js');

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
