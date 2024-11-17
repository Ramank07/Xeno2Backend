const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const AudienceSegment=require('./AudienceSegment')
const Customer=require('./Customer')
const CustomerAudienceSegment = sequelize.define('CustomerAudienceSegment', {
    segment_id: { type: DataTypes.INTEGER, references: { model: AudienceSegment, key: 'id' }, allowNull: false },
    customer_id: { type: DataTypes.INTEGER, references: { model: Customer, key: 'id' }, allowNull: false }
});
module.exports=CustomerAudienceSegment;