import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';

export default function AdminDashboard() {
  const [overview, setOverview] = useState({ departmentStats: {} });
  const [pending, setPending] = useState([]);
  const navigate = useNavigate();

  const load = () => {
    api.get('/admin/overview').then((res) => setOverview(res.data)).catch(() => {});
    api.get('/admin/pending-approvals').then((res) => setPending(res.data)).catch(() => {});
  };

  useEffect(() => { load(); }, []);

  const approve = async (id) => {
    await api.put(`/admin/${id}/approve`);
    load();
  };

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Ward Overview</h1>
        <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="text-xs text-gray-400">Logout</button>
      </div>

      <h2 className="font-semibold mb-2">Departments</h2>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {Object.entries(overview.departmentStats || {}).map(([dept, stats]) => (
          <div key={dept} className="bg-[#132038] rounded-xl p-3">
            <p className="text-teal-400 font-semibold text-sm">{dept}</p>
            <p className="text-xs text-gray-400 mt-1">Total: {stats.total}</p>
            <p className="text-xs text-yellow-400">Pending: {stats.pending}</p>
            <p className="text-xs text-blue-400">In progress: {stats.inProgress}</p>
            <p className="text-xs text-teal-400">Awaiting officer verify: {stats.awaitingVerification}</p>
            <p className="text-xs text-orange-400">Awaiting your approval: {stats.pendingApproval}</p>
            <p className="text-xs text-green-400">Resolved: {stats.resolved}</p>
            {stats.critical > 0 && <p className="text-xs text-red-400">Critical: {stats.critical}</p>}
          </div>
        ))}
      </div>

      <h2 className="font-semibold mb-2">Pending your approval ({pending.length})</h2>
      <div className="space-y-3">
        {pending.map((g) => (
          <div key={g._id} className="bg-[#132038] rounded-xl p-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400">{g.grievanceId}</span>
              <span className="text-orange-400">{g.severity}</span>
            </div>
            <p className="font-medium">{g.description}</p>
            <p className="text-xs text-gray-400 mt-1">
              Department: {g.department} · Worker: {g.assignedWorker?.name || '-'}
            </p>
            <button onClick={() => approve(g._id)} className="w-full mt-3 bg-teal-400 text-black text-sm py-2 rounded-lg">
              Approve & resolve
            </button>
          </div>
        ))}
        {pending.length === 0 && <p className="text-gray-500 text-sm">Nothing awaiting approval.</p>}
      </div>
    </div>
  );
}