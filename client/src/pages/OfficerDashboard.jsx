import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';

export default function OfficerDashboard() {
  const [data, setData] = useState({ stats: {}, grievances: [], incidents: [], workers: [] });
  const navigate = useNavigate();

  const load = () => api.get('/officer/dashboard').then((res) => setData(res.data)).catch(() => {});

  useEffect(() => { load(); }, []);

  const verify = async (id, escalate) => {
    await api.put(`/officer/${id}/verify`, { escalate });
    load();
  };

  const assign = async (id, workerId) => {
    if (!workerId) return;
    await api.put(`/officer/${id}/assign`, { workerId });
    load();
  };

  const statusColor = {
    Reported: 'text-gray-400', Assigned: 'text-yellow-400', 'In Progress': 'text-blue-400',
    'Work Completed': 'text-teal-400', 'Pending Admin Approval': 'text-orange-400', Resolved: 'text-green-400'
  };

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">{data.department} Dashboard</h1>
        <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="text-xs text-gray-400">Logout</button>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-5 text-center">
        <div className="bg-[#132038] rounded-lg p-2"><p className="text-lg font-bold">{data.stats.total || 0}</p><p className="text-xs text-gray-400">Total</p></div>
        <div className="bg-[#132038] rounded-lg p-2"><p className="text-lg font-bold text-yellow-400">{data.stats.pending || 0}</p><p className="text-xs text-gray-400">Pending</p></div>
        <div className="bg-[#132038] rounded-lg p-2"><p className="text-lg font-bold text-blue-400">{data.stats.inProgress || 0}</p><p className="text-xs text-gray-400">In progress</p></div>
        <div className="bg-[#132038] rounded-lg p-2"><p className="text-lg font-bold text-teal-400">{data.stats.awaitingVerification || 0}</p><p className="text-xs text-gray-400">To verify</p></div>
        <div className="bg-[#132038] rounded-lg p-2"><p className="text-lg font-bold text-green-400">{data.stats.resolved || 0}</p><p className="text-xs text-gray-400">Resolved</p></div>
        <div className="bg-[#132038] rounded-lg p-2"><p className="text-lg font-bold text-red-400">{data.stats.critical || 0}</p><p className="text-xs text-gray-400">Critical</p></div>
      </div>

      {data.workers?.length === 0 && (
        <p className="text-orange-400 text-xs mb-4">No workers registered in this department yet — register one to enable assignment.</p>
      )}

      {data.incidents?.length > 0 && (
        <div className="mb-5">
          <h2 className="font-semibold mb-2">Grouped incidents</h2>
          {data.incidents.map((inc) => (
            <div key={inc._id} className="bg-[#132038] rounded-lg p-3 mb-2 text-sm">
              <p className="text-teal-400">{inc.incidentId} — {inc.affectedCount} affected</p>
              <p className="text-gray-400 text-xs">{inc.address}</p>
            </div>
          ))}
        </div>
      )}

      <h2 className="font-semibold mb-2">All issues</h2>
      <div className="space-y-3">
        {data.grievances?.map((g) => (
          <div key={g._id} className="bg-[#132038] rounded-xl p-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400">{g.grievanceId}</span>
              <span className={statusColor[g.status] || 'text-gray-400'}>{g.status}</span>
            </div>
            <p className="font-medium">{g.description}</p>
            <p className="text-xs text-gray-400 mt-1">
              Worker: {g.assignedWorker?.name || 'Unassigned'} · Severity: {g.severity}
            </p>

            {!g.assignedWorker && data.workers?.length > 0 && (
              <select
                onChange={(e) => assign(g._id, e.target.value)}
                defaultValue=""
                className="w-full mt-2 p-2 rounded-lg bg-[#0f1a2b] border border-gray-700 text-sm"
              >
                <option value="" disabled>Assign a worker</option>
                {data.workers.map((w) => <option key={w._id} value={w._id}>{w.name}</option>)}
              </select>
            )}

            {g.status === 'Work Completed' && (
              <div className="flex gap-2 mt-3">
                <button onClick={() => verify(g._id, false)} className="flex-1 bg-teal-400 text-black text-sm py-2 rounded-lg">
                  Verify & resolve
                </button>
                <button onClick={() => verify(g._id, true)} className="flex-1 bg-orange-400 text-black text-sm py-2 rounded-lg">
                  Escalate to admin
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}