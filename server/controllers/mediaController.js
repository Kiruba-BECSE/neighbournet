const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const Grievance = require('../models/Grievance');

exports.uploadMedia = async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id);
    if (!grievance) return res.status(404).json({ message: 'Grievance not found' });

    if (!req.file) return res.status(400).json({ message: 'No image uploaded' });

    const formData = new FormData();
    formData.append('file', fs.createReadStream(req.file.path));

    const aiResponse = await axios.post('http://localhost:8000/detect', formData, {
      headers: formData.getHeaders()
    });

    const { object, confidence } = aiResponse.data;

    grievance.media.push({
      url: `/uploads/${req.file.filename}`,
      aiObject: object,
      aiConfidence: confidence
    });

    await grievance.save();
    res.status(200).json(grievance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};