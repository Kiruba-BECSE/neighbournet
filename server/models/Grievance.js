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
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true },
    address: { type: String },
    ward: { type: String }
  },
  media: [{
    url: { type: String },
    aiObject: { type: String },
    aiConfidence: { type: Number }
  }],
  afterMedia: [{ url: { type: String } }],
  department: { type: String },
  severity: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Low' },
  safetyRisk: { type: Boolean, default: false },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  status: {
    type: String,
    enum: ['Reported', 'Assigned', 'In Progress', 'Work Completed', 'Pending Admin Approval', 'Resolved'],
    default: 'Reported'
  },
  assignedWorker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  escalated: { type: Boolean, default: false },
  incident: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident', default: null },
  createdAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date }
});

grievanceSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Grievance', grievanceSchema);