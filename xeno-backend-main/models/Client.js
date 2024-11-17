const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const User = require('./User');

const Client = sequelize.define('Client', {
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
  organization_name: { type: DataTypes.STRING },
  contact_number: { type: DataTypes.STRING },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  tableName: 'Clients', 
  freezeTableName: true,// Explicitly specify the table name
});

module.exports = Client;
