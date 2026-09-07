const User = require('../models/User');
const Grievance = require('../models/Grievance');

const ACTIVE_STATUSES = ['Assigned', 'In Progress', 'Work Completed'];

const autoAssignWorker = async (grievance) => {
  const workers = await User.find({ role: 'worker', department: grievance.department });
  if (workers.length === 0) return null;

  let chosen = null;
  let lowestCount = Infinity;

  for (const worker of workers) {
    const activeCount = await Grievance.countDocuments({
      assignedWorker: worker._id,
      status: { $in: ACTIVE_STATUSES }
    });
    if (activeCount < lowestCount) {
      lowestCount = activeCount;
      chosen = worker;
    }
  }

  if (!chosen) return null;

  grievance.assignedWorker = chosen._id;
  grievance.status = 'Assigned';
  await grievance.save();

  return chosen;
};

module.exports = { autoAssignWorker };