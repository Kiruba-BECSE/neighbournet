const Grievance = require('../models/Grievance');
const Incident = require('../models/Incident');
const User = require('../models/User');

exports.getDashboard = async (req, res) => {
  const department = req.user.department;
  const grievances = await Grievance.find({ department })
    .populate('citizen', 'name')
    .populate('assignedWorker', 'name')
    .sort({ createdAt: -1 });

  const stats = {
    total: grievances.length,
    pending: grievances.filter(g => ['Reported', 'Assigned'].includes(g.status)).length,
    inProgress: grievances.filter(g => g.status === 'In Progress').length,
    awaitingVerification: grievances.filter(g => g.status === 'Work Completed').length,
    resolved: grievances.filter(g => g.status === 'Resolved').length,
    critical: grievances.filter(g => g.severity === 'Critical').length
  };

  const incidents = await Incident.find({ department }).populate('grievances');
  const workers = await User.find({ role: 'worker', department }).select('name _id');

  res.json({ department, stats, grievances, incidents, workers });
};

exports.assignWorker = async (req, res) => {
  const { workerId } = req.body;
  const grievance = await Grievance.findOne({ _id: req.params.id, department: req.user.department });
  if (!grievance) return res.status(404).json({ message: 'Not found' });

  const worker = await User.findOne({ _id: workerId, role: 'worker', department: req.user.department });
  if (!worker) return res.status(400).json({ message: 'Worker not found in this department' });

  grievance.assignedWorker = worker._id;
  if (grievance.status === 'Reported') grievance.status = 'Assigned';
  await grievance.save();

  res.json(grievance);
};

exports.verifyGrievance = async (req, res) => {
  const { escalate } = req.body;
  const grievance = await Grievance.findOne({ _id: req.params.id, department: req.user.department });
  if (!grievance) return res.status(404).json({ message: 'Not found' });
  if (grievance.status !== 'Work Completed') {
    return res.status(400).json({ message: 'Work must be marked completed by worker before verification' });
  }

  const needsAdminApproval = escalate === true || ['High', 'Critical'].includes(grievance.severity);

  if (needsAdminApproval) {
    grievance.status = 'Pending Admin Approval';
    grievance.escalated = true;
  } else {
    grievance.status = 'Resolved';
    grievance.resolvedAt = new Date();
  }

  await grievance.save();
  res.json(grievance);
};