import { useEffect, useState } from 'react';
import api from '../api.js';

export default function MyReports() {
  const [grievances, setGrievances] = useState([]);

  useEffect(() => {
    api.get('/grievances/my').then((res) => setGrievances(res.data)).catch(() => {});
  }, []);

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold mb-4">Your reports</h1>
      <div className="space-y-3">
        {grievances.map((g) => (
          <div key={g._id} className="bg-[#132038] rounded-xl p-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400">{g.grievanceId}</span>
              <span className="text-teal-400">{g.status}</span>
            </div>
            <p className="font-medium">{g.description}</p>
            <div className="flex justify-between text-xs mt-2">
              <span className="text-gray-400">{g.category} · {g.department}</span>
              <span className="text-orange-400">{g.priority}</span>
            </div>
          </div>
        ))}
        {grievances.length === 0 && <p className="text-gray-500 text-sm">No reports yet.</p>}
      </div>
    </div>
  );
}