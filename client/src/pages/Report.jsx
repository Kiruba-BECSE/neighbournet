import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';

const categories = ['Electricity', 'Water', 'Road', 'Garbage', 'Drainage', 'Streetlight', 'Other'];

export default function Report() {
  const [category, setCategory] = useState('Road');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [coords, setCoords] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const useCurrentLocation = () => {
    if (!navigator.geolocation) return setStatus('Geolocation not supported');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        setStatus('Location captured');
      },
      () => setStatus('Could not capture location')
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!coords) return setStatus('Please capture your location first');
    setStatus('Submitting...');
    try {
      const res = await api.post('/grievances', {
        category, description, address,
        latitude: coords.latitude, longitude: coords.longitude
      });
      const grievanceId = res.data.grievance._id;

      if (photo) {
        const formData = new FormData();
        formData.append('image', photo);
        await api.post(`/grievances/${grievanceId}/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      setStatus('Report submitted!');
      setTimeout(() => navigate('/'), 800);
    } catch (err) {
      setStatus(err.response?.data?.message || 'Submission failed');
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold mb-4">Report a civic issue</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-gray-400">Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 mt-1 rounded-lg bg-[#132038] border border-gray-700">
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-400">Describe the issue</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell us what happened, when, and how it affects the neighbourhood."
            className="w-full p-3 mt-1 rounded-lg bg-[#132038] border border-gray-700 h-24" required />
        </div>

        <div>
          <label className="text-sm text-gray-400">Where is it?</label>
          <input value={address} onChange={(e) => setAddress(e.target.value)}
            placeholder="Street, landmark, or nearby address"
            className="w-full p-3 mt-1 rounded-lg bg-[#132038] border border-gray-700" />
        </div>

        <button type="button" onClick={useCurrentLocation}
          className="w-full flex justify-between items-center p-3 rounded-lg bg-[#132038] border border-gray-700 text-teal-400">
          <span>📍 Use my current location</span>
          {coords && <span className="text-xs text-green-400">✓ captured</span>}
        </button>

        <div>
          <label className="text-sm text-gray-400">Add a photo (optional)</label>
          <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])}
            className="w-full p-3 mt-1 rounded-lg bg-[#132038] border border-gray-700 border-dashed" />
        </div>

        {status && <p className="text-sm text-teal-300">{status}</p>}

        <button className="w-full bg-teal-400 text-black font-semibold p-3 rounded-lg">
          Submit report
        </button>
      </form>
    </div>
  );
}