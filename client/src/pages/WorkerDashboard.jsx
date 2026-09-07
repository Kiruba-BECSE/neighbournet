import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';

export default function WorkerDashboard() {
  const [tasks, setTasks] = useState([]);
  const [uploadingId, setUploadingId] = useState(null);
  const navigate = useNavigate();

  const load = () => api.get('/worker/my-tasks').then((res) => setTasks(res.data)).catch(() => {});

  useEffect(() => { load(); }, []);

  const startWork = async (id) => {
    await api.put(`/worker/${id}/start`);
    load();
  };

  const completeWork = async (id, file) => {
    setUploadingId(id);
    const formData = new FormData();
    if (file) formData.append('afterImage', file);
    await api.put(`/worker/${id}/complete`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    setUploadingId(null);
    load();
  };

  const statusColor = {
    Assigned: 'text-yellow-400', 'In Progress': 'text-blue-400',
    'Work Completed': 'text-teal-400', Resolved: 'text-green-400'
  };

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">My Tasks</h1>
        <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="text-xs text-gray-400">Logout</button>
      </div>
      <div className="space-y-3">
        {tasks.map((t) => (
          <div key={t._id} className="bg-[#132038] rounded-xl p-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400">{t.grievanceId}</span>
              <span className={statusColor[t.status] || 'text-gray-400'}>{t.status}</span>
            </div>
            <p className="font-medium">{t.description}</p>
            <p className="text-xs text-gray-400 mt-1">{t.location?.address}</p>
            <div className="flex gap-2 mt-3">
              {t.status === 'Assigned' && (
                <button onClick={() => startWork(t._id)} className="flex-1 bg-blue-500 text-black text-sm py-2 rounded-lg">
                  Start work
                </button>
              )}
              {t.status === 'In Progress' && (
                <label className="flex-1 bg-teal-400 text-black text-sm py-2 rounded-lg text-center cursor-pointer">
                  {uploadingId === t._id ? 'Uploading...' : 'Mark completed'}
                  <input type="file" accept="image/*" className="hidden"
                    onChange={(e) => completeWork(t._id, e.target.files[0])} />
                </label>
              )}
              {['Work Completed', 'Pending Admin Approval', 'Resolved'].includes(t.status) && (
                <span className="flex-1 text-center text-xs text-gray-400 py-2">Awaiting verification</span>
              )}
            </div>
          </div>
        ))}
        {tasks.length === 0 && <p className="text-gray-500 text-sm">No tasks assigned yet.</p>}
      </div>
    </div>
  );
}