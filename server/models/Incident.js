const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  incidentId: { type: String, unique: true },
  category: { type: String, required: true },
  department: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }
  },
  address: { type: String },
  grievances: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Grievance' }],
  affectedCount: { type: Number, default: 1 },
  severity: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Low' },
  status: {
    type: String,
    enum: ['Reported', 'Verified', 'Assigned', 'In Progress', 'Resolved'],
    default: 'Reported'
  },
  createdAt: { type: Date, default: Date.now }
});

incidentSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Incident', incidentSchema);