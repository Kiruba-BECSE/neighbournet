import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api.js';

export default function Home() {
  const [grievances, setGrievances] = useState([]);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/grievances/my').then((res) => setGrievances(res.data)).catch(() => {});
  }, []);

  const active = grievances.filter((g) => g.status !== 'Resolved').length;
  const resolvedThisMonth = grievances.filter((g) => {
    if (g.status !== 'Resolved') return false;
    const d = new Date(g.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const priorityColor = { High: 'text-orange-400', Critical: 'text-red-400', Medium: 'text-yellow-400', Low: 'text-gray-400' };

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-4">
        <p className="text-teal-400 text-xs tracking-wide">NEIGHBOURNET</p>
        <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="text-xs text-gray-400">
          Logout
        </button>
      </div>
      <h1 className="text-2xl font-bold leading-snug">Make your ward heard.</h1>
      <p className="text-gray-400 mt-1 text-sm">Small reports become visible change.</p>

      <Link to="/report" className="block mt-5 bg-teal-400 text-black font-semibold text-center p-4 rounded-xl">
        Report a civic issue  +
      </Link>

      <div className="flex justify-between mt-6 text-center">
        <div><p className="text-teal-400 text-xl font-bold">{active}</p><p className="text-xs text-gray-400">Active reports</p></div>
        <div><p className="text-teal-400 text-xl font-bold">{resolvedThisMonth}</p><p className="text-xs text-gray-400">Resolved this month</p></div>
        <div><p className="text-orange-400 text-xl font-bold">{user.ward || '-'}</p><p className="text-xs text-gray-400">Your ward</p></div>
      </div>

      <div className="flex justify-between items-center mt-6 mb-2">
        <h2 className="font-semibold">Your recent reports</h2>
        <Link to="/my-reports" className="text-teal-400 text-sm">View all</Link>
      </div>

      <div className="space-y-3">
        {grievances.slice(0, 3).map((g) => (
          <div key={g._id} className="bg-[#132038] rounded-xl p-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400">{g.grievanceId}</span>
              <span className="text-teal-400">{g.status}</span>
            </div>
            <p className="font-medium">{g.description.slice(0, 50)}...</p>
            <div className="flex justify-between text-xs mt-2">
              <span className="text-gray-400">{g.location?.address}</span>
              <span className={priorityColor[g.priority] || 'text-gray-400'}>{g.priority}</span>
            </div>
          </div>
        ))}
        {grievances.length === 0 && <p className="text-gray-500 text-sm">No reports yet.</p>}
      </div>
    </div>
  );
}