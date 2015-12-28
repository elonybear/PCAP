module.exports = function(sequelize, DataTypes){
	var facility = sequelize.define('facility', {
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				len: [1]
			}
		},
		count: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0
		}	
	}, {
		hooks: {
			beforeValidate: function(user, options){
				if(typeof facility.name === 'string'){
					facility.name = facility.name.toUpperCase();
				}
			}
		}
	});
	return facility;
}
