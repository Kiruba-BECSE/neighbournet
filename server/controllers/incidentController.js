const Incident = require('../models/Incident');

exports.getAllIncidents = async (req, res) => {
  const filter = req.query.department ? { department: req.query.department } : {};
  const incidents = await Incident.find(filter).populate('grievances').sort({ createdAt: -1 });
  res.json(incidents);
};

exports.getIncidentById = async (req, res) => {
  const incident = await Incident.findById(req.params.id).populate({
    path: 'grievances',
    populate: { path: 'citizen', select: 'name email' }
  });
  if (!incident) return res.status(404).json({ message: 'Not found' });
  res.json(incident);
};