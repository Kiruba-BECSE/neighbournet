const mongoose = require('mongoose');

const grievanceSchema = new mongoose.Schema({
  grievanceId: { type: String, unique: true },
  citizen: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: {
    type: String,
    enum: ['Electricity', 'Water', 'Road', 'Garbage', 'Drainage', 'Streetlight', 'Other'],
    required: true
  },
  description: { type: String, required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String }
  },
  media: [{ type: String }], // Cloudinary/S3 URLs, added properly in Module 5
  department: { type: String }, // auto-mapped from category, refined in Module 4/7
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  status: {
    type: String,
    enum: ['Reported', 'Verified', 'Assigned', 'In Progress', 'Resolved'],
    default: 'Reported'
  },
  createdAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date }
});

module.exports = mongoose.model('Grievance', grievanceSchema);