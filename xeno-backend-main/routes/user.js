const express = require('express');
const authenticateJWT = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();
router.get('/profile', authenticateJWT, async (req, res) => {
try {
const user = await User.findByPk(req.user.id);
res.json(user);
} catch (error) {
res.status(500).json({ message: 'Failed to retrieve user profile' });
}
});
module.exports = router