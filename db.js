var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var sqlze;

if(env == 'production') {
	sqlze = new Sequelize(process.env.DATABASE_URL, {
		dialect: 'postgres'
	});
}
else {
	sqlze = new Sequelize(undefined, undefined, undefined, {
		'dialect': 'sqlite',
		'storage': __dirname + '/data/pcap-db.sqlite'
	});
}


var db = {};

db.piece = sqlze.import(__dirname + '/models/piece.js');

db.sequelize = sqlze;
db.Sequelize = Sequelize;

module.exports = db;
