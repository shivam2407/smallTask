const mongoose = require('mongoose');

const UsersSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
}, {
  autoIndex: true,
});

const Users = mongoose.model('Users', UsersSchema);
module.exports = Users;
