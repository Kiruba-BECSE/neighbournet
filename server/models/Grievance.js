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
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: { type: [Number], required: true },
    address: { type: String },
    ward: { type: String }
  },
  media: [{ type: String }],
  department: { type: String },
  severity: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Low' },
  safetyRisk: { type: Boolean, default: false },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  status: {
    type: String,
    enum: ['Reported', 'Verified', 'Assigned', 'In Progress', 'Resolved'],
    default: 'Reported'
  },
  createdAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date }
});

grievanceSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Grievance', grievanceSchema);