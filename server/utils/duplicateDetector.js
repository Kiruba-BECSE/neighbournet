const Grievance = require('../models/Grievance');
const Incident = require('../models/Incident');
const { jaccardSimilarity } = require('./textSimilarity');

const PROXIMITY_METERS = 150;
const TEXT_SIMILARITY_THRESHOLD = 0.15;

const generateIncidentId = (department) => {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${department.toUpperCase().slice(0, 2)}${year}${rand}`;
};

// Called right after a grievance is created
const checkAndLinkDuplicate = async (grievance) => {
  // Find other unresolved grievances, same category, nearby, not already grouped
  const nearbyCandidates = await Grievance.find({
    _id: { $ne: grievance._id },
    category: grievance.category,
    status: { $ne: 'Resolved' },
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates: grievance.location.coordinates },
        $maxDistance: PROXIMITY_METERS
      }
    }
  });

  // Filter further by text similarity
  const matches = nearbyCandidates.filter(
    (c) => jaccardSimilarity(c.description, grievance.description) >= TEXT_SIMILARITY_THRESHOLD
  );

  if (matches.length === 0) return null;

  // If one of the matches already belongs to an incident, join that incident
  const existingIncidentMatch = matches.find((m) => m.incident);

  let incident;
  if (existingIncidentMatch) {
    incident = await Incident.findById(existingIncidentMatch.incident);
    incident.grievances.push(grievance._id);
    incident.affectedCount = incident.grievances.length;
    if (grievance.severity === 'Critical' || incident.severity !== 'Critical') {
      incident.severity = grievance.severity === 'Critical' ? 'Critical' : incident.severity;
    }
    await incident.save();
  } else {
    // Create a new incident grouping this grievance + the first match
    const seedMatch = matches[0];
    incident = await Incident.create({
      incidentId: generateIncidentId(grievance.department),
      category: grievance.category,
      department: grievance.department,
      location: grievance.location,
      address: grievance.location.address,
      grievances: [seedMatch._id, grievance._id],
      affectedCount: 2,
      severity: grievance.severity
    });
    seedMatch.incident = incident._id;
    await seedMatch.save();
  }

  grievance.incident = incident._id;
  await grievance.save();

  return incident;
};

module.exports = { checkAndLinkDuplicate };