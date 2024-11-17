const express = require("express");
const Client=require('../models/Client')
const Customer=require('../models/Customer')
const { Op } = require('sequelize');
const router = express.Router();
const {
  Clients,
  Customers,
  User,
  CustomerAudienceSegment,
  AudienceSegment,
  Campaign,
  sequelize,
} = require("../models/relations"); // Adjust the path to your models
const Sequelize = require('sequelize')
const authenticateJWT = require("../middleware/auth");

// Route to create a new audience segment
router.post("/segments", authenticateJWT, async (req, res) => {
  const { name, conditions } = req.body;
  const userId = req.user.id; // Assuming authenticateUser sets req.user
  
  try {
    // Find the Client associated with the authenticated user
    const client = await Client.findOne({ where: { user_id: userId } });
    if (!client) {
      return res.status(403).json({ message: "Unauthorized access." });
    }

    // Apply conditions to get audience size (example)
    const conditionQuery = buildConditionQuery(conditions);
    const audienceSize = await Customer.count({ where: conditionQuery });

    // Create the new AudienceSegment
    const newSegment = await AudienceSegment.create({
      client_id: client.user_id,
      name,
      conditions,
      audience_size: audienceSize,
    });

    res
      .status(201)
      .json({ message: "Segment created successfully.", segment: newSegment });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while creating the segment." });
  }
});

// Utility function to build a Sequelize query from conditions
function buildConditionQuery(conditions) {
  const query = {};
  // Example handling for different conditions:
  conditions.forEach((condition) => {
    const { field, operator, value } = condition;
    if (field && operator && value) {
      switch (operator) {
        case ">":
          query[field] = { [Sequelize.Op.gt]: value };
          break;
        case ">=":
          query[field] = { [Sequelize.Op.gte]: value };
          break;
        case "<":
          query[field] = { [Sequelize.Op.lt]: value };
          break;
        case "<=":
          query[field] = { [Sequelize.Op.lte]: value };
          break;
        case "=":
          query[field] = { [Sequelize.Op.eq]: value };
          break;
        // Add more cases for other operators as needed
        default:
          throw new Error(`Unsupported operator: ${operator}`);
      }
    }
  });
  return query;
}
router.get('/segments', authenticateJWT, async (req, res) => {
  try {
      const client = await Client.findOne({ where: { user_id: req.user.id } });
      if (!client) return res.status(404).json({ message: 'Client not found for this user' });

      const segments = await AudienceSegment.findAll({ where: { client_id: client.id } });
      if (!segments) return res.status(404).json({ message: 'No segments found' });

      res.json(segments);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
