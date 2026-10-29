const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);

module.exports = router;

// Get all users for the Admin/Manager to assign tasks
router.get('/users', async (req, res) => {
  try {
    // Only fetch name, email, and role from the database
    const users = await User.find({}, 'name email role');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});