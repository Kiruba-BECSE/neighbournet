import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Home from './pages/Home.jsx';
import Report from './pages/Report.jsx';
import MyReports from './pages/MyReports.jsx';
import MapView from './pages/MapView.jsx';
import Alerts from './pages/Alerts.jsx';
import WorkerDashboard from './pages/WorkerDashboard.jsx';
import OfficerDashboard from './pages/OfficerDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Navbar from './components/Navbar.jsx';

const isAuthed = () => !!localStorage.getItem('token');
const getRole = () => JSON.parse(localStorage.getItem('user') || '{}').role;

const Protected = ({ children, role }) => {
  if (!isAuthed()) return <Navigate to="/login" />;
  if (role && getRole() !== role) return <Navigate to="/login" />;
  return children;
};

function App() {
  const role = getRole();
  const showCitizenNav = isAuthed() && role === 'citizen';

  return (
    <div className="min-h-screen pb-20 max-w-md mx-auto">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<Protected role="citizen"><Home /></Protected>} />
        <Route path="/report" element={<Protected role="citizen"><Report /></Protected>} />
        <Route path="/my-reports" element={<Protected role="citizen"><MyReports /></Protected>} />
        <Route path="/map" element={<Protected role="citizen"><MapView /></Protected>} />
        <Route path="/alerts" element={<Protected role="citizen"><Alerts /></Protected>} />

        <Route path="/worker" element={<Protected role="worker"><WorkerDashboard /></Protected>} />
        <Route path="/officer" element={<Protected role="officer"><OfficerDashboard /></Protected>} />
        <Route path="/admin" element={<Protected role="admin"><AdminDashboard /></Protected>} />
      </Routes>
      {showCitizenNav && <Navbar />}
    </div>
  );
}

export default App;