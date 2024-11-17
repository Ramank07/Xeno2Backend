const { DataTypes, INTEGER } = require('sequelize');
const sequelize = require('../sequelize');
const AudienceSegment = sequelize.define('AudienceSegment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    client_id: { type: DataTypes.UUID, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    conditions: { type: DataTypes.JSON, allowNull: false },
    audience_size: { type: DataTypes.INTEGER, allowNull: false }
});
module.exports = AudienceSegment;