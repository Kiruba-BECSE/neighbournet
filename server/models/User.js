const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: {
    type: String,
    enum: ['citizen', 'worker', 'officer', 'admin'],
    default: 'citizen'
  },
  department: { type: String }, // for 'officer'/'worker' e.g. EB, Water, Road, Sanitation
  ward: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);