const Grievance = require('../models/Grievance');
const DEPARTMENTS = require('../utils/departments');

exports.getWardOverview = async (req, res) => {
  const departmentStats = {};

  for (const dept of DEPARTMENTS) {
    const deptGrievances = await Grievance.find({ department: dept });
    departmentStats[dept] = {
      total: deptGrievances.length,
      pending: deptGrievances.filter(g => ['Reported', 'Assigned'].includes(g.status)).length,
      inProgress: deptGrievances.filter(g => g.status === 'In Progress').length,
      awaitingVerification: deptGrievances.filter(g => g.status === 'Work Completed').length,
      pendingApproval: deptGrievances.filter(g => g.status === 'Pending Admin Approval').length,
      resolved: deptGrievances.filter(g => g.status === 'Resolved').length,
      critical: deptGrievances.filter(g => g.severity === 'Critical').length
    };
  }

  res.json({ departmentStats });
};

exports.getPendingApprovals = async (req, res) => {
  const grievances = await Grievance.find({ status: 'Pending Admin Approval' })
    .populate('citizen', 'name')
    .populate('assignedWorker', 'name')
    .sort({ createdAt: -1 });
  res.json(grievances);
};

exports.approveGrievance = async (req, res) => {
  const grievance = await Grievance.findById(req.params.id);
  if (!grievance) return res.status(404).json({ message: 'Not found' });
  if (grievance.status !== 'Pending Admin Approval') {
    return res.status(400).json({ message: 'This issue is not awaiting admin approval' });
  }

  grievance.status = 'Resolved';
  grievance.resolvedAt = new Date();
  await grievance.save();
  res.json(grievance);
};