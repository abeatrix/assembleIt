const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        username: {type: String, required: [true, 'you must provide a username.'] },
        password: {type: String, required: true},
        email: {type: String, required: true},
        karma: {type: Number, default: 0},
        profilePic: {type: String, default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'},
        posts: [
            // reference
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Post",
            },
          ],
          comments: [
            // reference
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Comment",
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
