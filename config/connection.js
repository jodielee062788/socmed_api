// Import necessary modules from Mongoose
const { connect, connection } = require('mongoose');

// Define the MongoDB connection string
const connectionString = 'mongodb://127.0.0.1:27017/usersDB';

// Establish the connection to the MongoDB database
connect(connectionString);

module.exports = connection;