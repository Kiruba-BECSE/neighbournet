const Grievance = require('../models/Grievance');

exports.getMyTasks = async (req, res) => {
  const tasks = await Grievance.find({ assignedWorker: req.user.id })
    .populate('citizen', 'name')
    .sort({ createdAt: -1 });
  res.json(tasks);
};

exports.startWork = async (req, res) => {
  const grievance = await Grievance.findOne({ _id: req.params.id, assignedWorker: req.user.id });
  if (!grievance) return res.status(404).json({ message: 'Task not found' });
  grievance.status = 'In Progress';
  await grievance.save();
  res.json(grievance);
};

exports.completeWork = async (req, res) => {
  const grievance = await Grievance.findOne({ _id: req.params.id, assignedWorker: req.user.id });
  if (!grievance) return res.status(404).json({ message: 'Task not found' });

  if (req.file) {
    grievance.afterMedia.push({ url: `/uploads/${req.file.filename}` });
  }
  grievance.status = 'Work Completed';
  await grievance.save();
  res.json(grievance);
};