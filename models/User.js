const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        username: {type: String, required: [true, 'you must provide a username.'] },
        password: {type: String, required: true},
        email: {type: String, required: true},
        karma: {type: Number, default: 0},
        posts: [
            // reference
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Post",
            },
          ],
    },
    {
        timestamps: true,
        createdAt: "signupAt"
    }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
