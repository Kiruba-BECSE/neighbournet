const Grievance = require('../models/Grievance');
const departmentMap = require('../utils/departmentMap');

const generateGrievanceId = () => {
  const year = new Date().getFullYear();
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `GRV-${year}-${rand}`;
};

exports.createGrievance = async (req, res) => {
  try {
    const { category, description, latitude, longitude, address, media } = req.body;

    const grievance = await Grievance.create({
      grievanceId: generateGrievanceId(),
      citizen: req.user.id,
      category,
      description,
      location: { latitude, longitude, address },
      media: media || [],
      department: departmentMap[category] || 'General'
    });

    res.status(201).json(grievance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Citizen sees their own complaints
exports.getMyGrievances = async (req, res) => {
  const grievances = await Grievance.find({ citizen: req.user.id }).sort({ createdAt: -1 });
  res.json(grievances);
};

// Single grievance by ID
exports.getGrievanceById = async (req, res) => {
  const grievance = await Grievance.findById(req.params.id).populate('citizen', 'name email');
  if (!grievance) return res.status(404).json({ message: 'Not found' });
  res.json(grievance);
};

// Officers/admin: view all, optionally filtered by department
exports.getAllGrievances = async (req, res) => {
  const filter = req.query.department ? { department: req.query.department } : {};
  const grievances = await Grievance.find(filter).populate('citizen', 'name email').sort({ createdAt: -1 });
  res.json(grievances);
};