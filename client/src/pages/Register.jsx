import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api.js';
import { redirectByRole } from '../utils/roleRedirect.js';

const DEPARTMENTS = ['EB', 'Water', 'Road', 'Sanitation', 'Drainage', 'General'];

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'citizen', department: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/register', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      redirectByRole(res.data.user.role, navigate);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const needsDept = form.role === 'worker' || form.role === 'officer';

  return (
    <div className="p-6 flex flex-col justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-1 text-teal-400">Create account</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <input name="name" placeholder="Full name" onChange={handleChange}
          className="w-full p-3 rounded-lg bg-[#132038] border border-gray-700 outline-none" required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange}
          className="w-full p-3 rounded-lg bg-[#132038] border border-gray-700 outline-none" required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange}
          className="w-full p-3 rounded-lg bg-[#132038] border border-gray-700 outline-none" required />
        <select name="role" value={form.role} onChange={handleChange}
          className="w-full p-3 rounded-lg bg-[#132038] border border-gray-700 outline-none">
          <option value="citizen">Citizen</option>
          <option value="worker">Worker</option>
          <option value="officer">Department Officer</option>
          <option value="admin">Ward Admin</option>
        </select>
        {needsDept && (
          <select name="department" value={form.department} onChange={handleChange}
            className="w-full p-3 rounded-lg bg-[#132038] border border-gray-700 outline-none" required>
            <option value="">Select department</option>
            {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        )}
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button className="w-full bg-teal-400 text-black font-semibold p-3 rounded-lg">Register</button>
      </form>
      <p className="text-gray-400 mt-4 text-sm">
        Have an account? <Link to="/login" className="text-teal-400">Login</Link>
      </p>
    </div>
  );
}