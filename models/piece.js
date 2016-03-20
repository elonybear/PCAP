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
			defaultValue: ""
		},
		facility_upper: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: ""
		},
		location: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: ""
		},
		location_upper: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: ""
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
		},
		crit_email: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: ""
		},
		crit_name: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: ""
		}
	})
}
