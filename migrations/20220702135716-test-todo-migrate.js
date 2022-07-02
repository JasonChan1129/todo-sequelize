'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn(`Todos`, `urgent`, {
			type: Sequelize.BOOLEAN,
			allowNull: true,
		});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.removeColumn(`Todos`, `urgent`);
	},
};
