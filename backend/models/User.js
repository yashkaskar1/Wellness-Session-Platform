const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, index: true },
  password_hash: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
