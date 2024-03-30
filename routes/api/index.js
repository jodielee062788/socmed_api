// Set up express router
const router = require('express').Router();

// Import route handlers
const userRoutes = require('./userRoutes');
const thoughtRoutes = require('./thoughtRoutes');

// Define routes
router.use('/users', userRoutes);
router.use('/thoughts', thoughtRoutes);

module.exports = router;