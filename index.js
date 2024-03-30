// Import express
const express = require('express');

// Import the database connection setup
const db = require('./config/connection');

// Import the routes for the API
const routes = require('./routes');

// Define the port number
const PORT = process.env.PORT || 3001;

// Create an express app
const app = express();

// Middleware to parse incoming requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

db.once('open', () => {
    app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}!`);
    });
});