const express = require('express');
const router = express.Router();
const { AudienceSegment, Customer, CommunicationLog, CustomerAudienceSegment } = require('../models'); // Adjust path as needed
const { sequelize } = require('../models'); // Sequelize instance for transactions
const { Op } = require('sequelize');


// Route to start a new campaign for a segment
router.post('/campaigns/start', async (req, res) => {
  const { segment_id, campaign_name, message_template } = req.body;

  try {
    // Find the specified audience segment
    const segment = await AudienceSegment.findByPk(segment_id);
    if (!segment) {
      return res.status(404).json({ message: 'Audience segment not found' });
    }

    // Find all customers in the segment (using the many-to-many join table)
    const customersInSegment = await CustomerAudienceSegment.findAll({
      where: { segment_id },
      include: [{ model: Customer }]
    });

    // Begin a transaction
    const transaction = await sequelize.transaction();

    try {
      // Iterate over customers to send messages and log communication
      const logs = await Promise.all(customersInSegment.map(async (segmentEntry) => {
        const customer = segmentEntry.Customer;

        // Customize the message with customer's name or other data as needed
        const personalizedMessage = message_template.replace('[Name]', customer.name);

        // Create a log for the message in CommunicationLog
        const log = await CommunicationLog.create({
          segment_id,
          customer_id: customer.customer_id,
          campaign_name,
          message: personalizedMessage,
          status: Math.random() < 0.9 ? 'SENT' : 'FAILED' // 90% chance of 'SENT', 10% of 'FAILED'
        }, { transaction });

        return log;
      }));

      // Commit the transaction if all logs are created successfully
      await transaction.commit();

      res.status(201).json({
        message: 'Campaign started successfully',
        campaign: {
          segment_id,
          campaign_name,
          total_customers: customersInSegment.length,
          sent_logs: logs
        }
      });
    } catch (error) {
      // Rollback the transaction in case of an error
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while starting the campaign.' });
  }
});

module.exports=router;