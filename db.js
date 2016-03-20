var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var sequelize;

if(env == 'production') {
	sequelize = new Sequelize(process.env.DATABASE_URL, {
		dialect: 'postgres'
	});
}
else {
	sequelize = new Sequelize(undefined, undefined, undefined, {
		'dialect': 'sqlite',
		'storage': __dirname + '/data/pcap-db.sqlite'
	});
}


var db = {};

db.piece = sequelize.import(__dirname + '/models/piece.js');

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
