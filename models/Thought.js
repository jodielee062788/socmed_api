const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction');

// Define Thought schema
const thoughtSchema = new Schema(
    {
      thoughtText: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280,
      },
      createdAt: {
        type: Date,
        default: Date.now,
        // getter method to format timestamp
        get: createdAt => {
            return new Date(createdAt).toLocaleString();
        }
      },
      username: {
        type: String,
        required: true,
      },
      // nested documents created
      reactions: [reactionSchema],
    },
    {
      toJSON: {
        getters: true,
      },
      id: false
    }    
);

// Define virtual field reactionCount
thoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
});

const Thought = model('thought', thoughtSchema);

module.exports = Thought;