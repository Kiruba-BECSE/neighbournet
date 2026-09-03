const Grievance = require('../models/Grievance');
const departmentMap = require('../utils/departmentMap');
const { classifyText } = require('../utils/nlpClassifier');

const generateGrievanceId = () => {
  const year = new Date().getFullYear();
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `GRV-${year}-${rand}`;
};

exports.createGrievance = async (req, res) => {
  try {
    const { category, description, latitude, longitude, address, ward, media } = req.body;

    const { severity, safetyRisk } = classifyText(description);

    const grievance = await Grievance.create({
      grievanceId: generateGrievanceId(),
      citizen: req.user.id,
      category,
      description,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude],
        address,
        ward
      },
      media: media || [],
      department: departmentMap[category] || 'General',
      severity,
      safetyRisk,
      priority: severity // Module 7 will replace this with a full scoring formula
    });

    res.status(201).json(grievance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyGrievances = async (req, res) => {
  const grievances = await Grievance.find({ citizen: req.user.id }).sort({ createdAt: -1 });
  res.json(grievances);
};

exports.getGrievanceById = async (req, res) => {
  const grievance = await Grievance.findById(req.params.id).populate('citizen', 'name email');
  if (!grievance) return res.status(404).json({ message: 'Not found' });
  res.json(grievance);
};

exports.getAllGrievances = async (req, res) => {
  const filter = req.query.department ? { department: req.query.department } : {};
  const grievances = await Grievance.find(filter).populate('citizen', 'name email').sort({ createdAt: -1 });
  res.json(grievances);
};

exports.getNearbyGrievances = async (req, res) => {
  const { longitude, latitude, radius = 200 } = req.query;
  if (!longitude || !latitude) {
    return res.status(400).json({ message: 'longitude and latitude are required' });
  }

  const nearby = await Grievance.find({
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)] },
        $maxDistance: parseInt(radius)
      }
    }
  });

  res.json(nearby);
};

exports.getMapData = async (req, res) => {
  const grievances = await Grievance.find({}, 'grievanceId category status location severity');
  res.json(grievances);
};