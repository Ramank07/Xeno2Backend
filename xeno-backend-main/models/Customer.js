const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const User = require('./User');

const Customer = sequelize.define('Customer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id:{
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  },
  total_spending: { type: DataTypes.DECIMAL, defaultValue: 0 },
  visit_count: { type: DataTypes.INTEGER, defaultValue: 0  },
  last_visit_date: { type: DataTypes.DATE },
}, {
  tableName: 'Customers', // Explicitly specify the table name
});

module.exports = Customer;
