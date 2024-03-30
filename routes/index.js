// Set up express router
const router = require('express').Router();

// Import API routes
const apiRoutes = require('./api');

router.use('/api', apiRoutes);

// Middleware for handling incorrect routes
router.use((req, res) => res.send('Wrong route!'));

module.exports = router;