const { Schema, model } = require('mongoose');

// Defining user schema
const userSchema = new Schema(
    {
      username: {
        type: String,
        unique: true,
        required: true,
        trim: true, // Trims whitespaces from the string
      },
      email: {
        type: String,
        required: true,
        unique: true,
        // Built-in validation for email
        validate: {
            validator: function(v) {
              return /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
          },
      },
      thoughts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'thought',
        },
      ],
      friends: [
        {
            type: Schema.Types.ObjectId,
            ref: 'user',
        },
      ],
    },
    {
        toJSON: {
            getters: true,
        },
    },
);

// Define virtual field friendCount
userSchema.virtual('friendCount').get(function() {
    return this.friends.length;
});

const User = model('user', userSchema);

module.exports = User;