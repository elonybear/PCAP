module.exports = function(sequelize, DataTypes){
	var artist = sequelize.define('user', {
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1]
			}
		},
		nickname: {
			type: DataTypes.STRING,
			validate: {
				len: [1]
			}
		},
		facility: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1]
			}
		}
	}, {
		hooks: {
			beforeValidate: function(user, options) {
				if(typeof artist.name === 'string'){
					artist.name = artist.name.toUpperCase();
				}
				if(typeof artist.nickname === 'string'){
					artist.nickname = artist.nickname.toUpperCase();
				}
			}
		}
	});
	return artist;
}
