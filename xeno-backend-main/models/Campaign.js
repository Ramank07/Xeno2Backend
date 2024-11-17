const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");
const Client = require("./Client");
const AudienceSegment = require("./AudienceSegment");
const Campaign = sequelize.define("Campaign", {
  campaign_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  client_id: { type: DataTypes.UUID, allowNull: false },
  segment_id: { type: DataTypes.UUID, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  message_template: { type: DataTypes.TEXT, allowNull: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

// Relationships with Client and AudienceSegment
Campaign.belongsTo(Client, { foreignKey: "client_id" });
Client.hasMany(Campaign, { foreignKey: "client_id" });
Campaign.belongsTo(AudienceSegment, { foreignKey: "segment_id" });
AudienceSegment.hasMany(Campaign, { foreignKey: "segment_id" });
