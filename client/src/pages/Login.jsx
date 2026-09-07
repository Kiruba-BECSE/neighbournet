import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api.js';
import { redirectByRole } from '../utils/roleRedirect.js';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      redirectByRole(res.data.user.role, navigate);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="p-6 flex flex-col justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-1 text-teal-400">NeighbourNet</h1>
      <p className="text-gray-400 mb-6">Login to continue</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded-lg bg-[#132038] border border-gray-700 outline-none" required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded-lg bg-[#132038] border border-gray-700 outline-none" required />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button className="w-full bg-teal-400 text-black font-semibold p-3 rounded-lg">Login</button>
      </form>
      <p className="text-gray-400 mt-4 text-sm">
        No account? <Link to="/register" className="text-teal-400">Register</Link>
      </p>
    </div>
  );
}