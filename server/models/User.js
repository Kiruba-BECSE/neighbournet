const mongoose = require('mongoose');
const DEPARTMENTS = require('../utils/departments');

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
  department: { type: String, enum: [...DEPARTMENTS, ''] },
  ward: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);