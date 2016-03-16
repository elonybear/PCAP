module.exports = function(sequelize, DataTypes) {
	return sequelize.define('piece', {
		title: {		
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1]
			}
		},
		title_upper: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		artist: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1]
			}
		},
		artist_upper: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		facility: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1]
			}
		},
		facility_upper: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		location: {
			type: DataTypes.STRING,
			validate: {
				len: [1]
			}
		},
		location_upper: {
			type: DataTypes.STRING,
		},
		artist_crit: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},
		piece_crit: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}
	})
}
