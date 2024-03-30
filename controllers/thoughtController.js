const { Thought, User, Reaction } = require('../models');

module.exports = {
  // Get all thoughts
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find()
        .select('-__v');

      res.json(thoughts);
      } catch (err) {
        res.status(500).json(err);
      }
    },

    // Get a single thought
    async getSingleThought(req, res) {
      try {
        const thought = await Thought.findOne({ _id: req.params.thoughtId })
          .select('-__v');

        if (!thought) {
          return res.status(404).json({ message: 'No thought with that ID' });
        }

        res.json(thought);
      } catch (err) {
        res.status(500).json(err);
      }
    },

    // Create a new thought
    async createThought(req, res) {
      try {
        const thought = await Thought.create(req.body);
        
        const user = await User.findOneAndUpdate(
          { _id: req.body.userId },
          { $push: { thoughts: thought._id}},
          { runValidators: true, new: true }
        );

        if (!user) {
          return res.status(404).json({ message: 'Associated user not found!' });
        }

        res.json(thought);
      } catch (err) {
        console.log(err);
        return res.status(500).json(err);
      }
    },

    // Update a thought
    async updateThought(req, res) {
      try {
        const thought = await Thought.findOneAndUpdate(
          { _id: req.params.thoughtId },
          { $set: req.body },
          { runValidators: true, new: true }
        );

        if (!thought) {
          return res.status(404).json({ message: 'No thought with this ID' });
        }

        res.json(thought);
      } catch (err) {
        res.status(500).json(err);
      }
    },

    // Delete a thought
    async deleteThought(req, res) {
      try {
        const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });

        if (!thought) {
          return res.status(404).json({ message: 'No thought with that ID' });
        }
        res.json({ message: 'Thought successfully deleted' });
       } catch (err) {
        console.log(err);
        res.status(500).json(err);
       }
    },

    // Create a Reaction on a thought
    async createReaction(req, res) {
      try {
        const thought = await Thought.findOneAndUpdate(
          { _id: req.params.thoughtId },
          { $addToSet: { reactions: req.body }},
          { runValidators: true, new: true } 
        );

        if(!thought) {
          return res.status(404).json({ message: 'No thought found with this ID' });
        }

        res.json(thought);
      } catch (err) {
        res.status(500).json(err);
      }
    },

    // Delete a rection based on reactionId
    async deleteReaction(req, res) {
      try {
        const thought = await Thought.findOneAndDelete(
          { _id: req.params.thoughtId },
          { $pull: { reaction: { reactionId: req.params.reactionId } } },
          { runValidators: true, new: true }
        );

        if(!thought) {
          return res.status(404).json({ message: 'No thought found with that ID' });
        }

        res.json(thought);
      } catch (err) {
        res.status(500).json(err);
      }
    },
};