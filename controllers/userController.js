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
        const users = await User.find()
          .select('-__v')
          ;
          
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
            .select('-__v')
            .populate('thoughts')
            .populate('friends');

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
          return res.status(404).json({ message: 'No user with this ID' });
        }

        res.json(user);
      } catch (err) {
        res.status(500).json(err);
      }
    },

    // Delete a user and remove thoughts asspciated with user
    async deleteUser(req, res) {
      try {
        const user = await User.findOneAndRemove({ _id: req.params.userId });

        if (!user) {
          return res.status(404).json({ message: 'No such user exists' });
        }

        // Find thoughts associated with the user
      const thoughts = await Thought.find({ username: user.username });

      if (thoughts.length > 0) {
        // If thoughts are found, delete them
        await Thought.deleteMany({ username: user.username });
        res.json({ message: 'User and associated thoughts successfully deleted' });
      } else {
        // If no thoughts are found, return a message indicating so
        res.json({ message: 'User successfully deleted. No associated thoughts found.' });
      }
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    },

    // Add Friend 
    async addFriend(req, res) {
      console.log('Friend added!');
      console.log(req.body);
    
      try {
        const user = await User.findOneAndUpdate(
          { _id: req.params.userId },
          { $addToSet: { friends: req.body.friendId || req.params.friendId } },
          { runValidators: true, new: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'No user found with that ID' });
      }

      res.json({ message: 'Friend added successfully', user });
    } catch (err) {
      res.status(500).json(err);
    }
  },
    
    // Remove Friend
    async removeFriend(req, res) {
      try {
        const user = await User.findOneAndUpdate(
          { _id: req.params.userId },
          { $pull: { friends: req.params.friendId } },
          { runValidators: true, new: true }
        );

        if (!user) {
          return res.status(404).json({ message: 'No user found with that ID' });
        }

        res.json({ message: 'Friend removed successfully', user });
      } catch (err) {
        res.status(500).json(err);
      }
    },
};