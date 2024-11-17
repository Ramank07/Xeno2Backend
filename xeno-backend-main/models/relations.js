const Customer = require("./Customer");
const User = require("./User.js");
const Client = require("./Client.js");

const CustomerAudienceSegment = require("./CustomerAudienceSegment.js");
const AudienceSegment = require("./AudienceSegment.js");
const Campaign = require("./Campaign.js");
const sequelize = require("../sequelize.js");

// Define Relations

User.hasOne(Client, { foreignKey: "user_id" , onDelete: 'CASCADE'});
Client.belongsTo(User, { foreignKey: "user_id" , onDelete: 'CASCADE'});

User.hasOne(Customer, { foreignKey: "user_id" , onDelete: 'CASCADE'});
Customer.belongsTo(User, { foreignKey: "user_id" , onDelete: 'CASCADE'});

Client.hasMany(AudienceSegment, { foreignKey: 'client_id', as: 'audienceSegments' , onDelete: 'CASCADE'});
AudienceSegment.belongsTo(Client, { foreignKey: 'client_id', as: 'client', onDelete: 'CASCADE' });

Customer.belongsToMany(AudienceSegment, {
  through: CustomerAudienceSegment,
  foreignKey: 'customer_id', 
   as: 'audienceSegments'
});

AudienceSegment.belongsToMany(Customer, {
  through: CustomerAudienceSegment,
  foreignKey: 'customer_id',
  otherKey: 'segment_id',
  as: 'customers'
});


module.exports = {
  Client,
  Customer,
  User,
  CustomerAudienceSegment,
  AudienceSegment,
  Campaign,
};
