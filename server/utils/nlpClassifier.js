const severityKeywords = {
  Critical: ['fire', 'collapsed', 'electrocution', 'live wire', 'exposed wire', 'sinkhole', 'flooding', 'accident', 'burst'],
  High: ['huge', 'large', 'big', 'major', 'dangerous', 'unsafe', 'days', 'hours', 'overflowing', 'no supply', 'not working'],
  Medium: ['small', 'minor', 'occasional', 'sometimes', 'partial'],
};

const safetyRiskKeywords = [
  'accident', 'fall', 'fell', 'injury', 'injured', 'danger', 'dangerous',
  'unsafe', 'children', 'school', 'bike', 'vehicle', 'electrocution', 'live wire'
];

const classifyText = (description) => {
  const text = description.toLowerCase();

  let severity = 'Low';
  for (const level of ['Critical', 'High', 'Medium']) {
    if (severityKeywords[level].some(word => text.includes(word))) {
      severity = level;
      break;
    }
  }

  const safetyRisk = safetyRiskKeywords.some(word => text.includes(word));

  if (safetyRisk && severity !== 'Critical') {
    severity = 'High';
  }

  return { severity, safetyRisk };
};

module.exports = { classifyText };