const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

// Aggregate function to get the total number of users
const headCount = async () => {
    const numberOfUsers = await User.aggregate()
      .count('userCount');
    return numberOfUsers;
}

module.exports = {
    // Get all users
    async getUsers(req, res) {
      try {
        const users = await User.find();

        const userObj = {
            users,
            headCount: await headCount(),
        };

        res.json(userObj);
      } catch (err) {
        console.log(err);
        return res.status(500).json(err);
      }
    },

    // Get a single user
    async getSingleUser(req, res) {
        try {
          // Find a user by their _id and exclude the '__v' field from the query result
          const user = await User.findOne({ _id: req.params.userId })
            .select('-__v');

          if (!user) {
            return res.status(404).json({ message: 'No user with that ID' })
          }

          res.json({
            user
          });
        } catch (err) {
          console.log(err);
          return res.status(500).json(err);
        }
    },

    // Create a New User 
    async createUser(req, res) {
      try {
        const user = await User.create(req.body);
        res.json(user);
      } catch (err) {
        res.status(500).json(err);
      }
    },

    // Update a user
    async updateUser(req, res) {
      try {
        const user = await User.findOneAndUpdate(
          { _id: req.params.userId },
          { $set: req.body }, // Use $set to update the fields with the values from 'req.body'
          { runValidators: true, new: true } // Run validators and return the updated document
        );

        if (!user) {
          res.status(404).json({ message: 'No user with this ID' });
        }

        res.json(user);
      } catch (err) {
        res.status(500).json(err);
      }
    },

    // Delete a user and remove thoughts
    async deleteUser(req, res) {
      try {
        const user = await User.findOneAndRemove({ _id: req.params.userId });

        if (!user) {
          return res.status(404).json({ message: 'No such user exists' });
        }

        const thought = await Thought.findOneAndUpdate(
          { users: req.params.userId },
          { $pull: { users: req.params.userId }},
          { new: true }
        );

        if (!thought) {
          return res.status.(404).json({
            message: 'User deleted, but no thoughts found',
          });
        }

        res.json({ message: 'User successfully deleted' });
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    },
}