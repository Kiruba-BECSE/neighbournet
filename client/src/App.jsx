import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Home from './pages/Home.jsx';
import Report from './pages/Report.jsx';
import MyReports from './pages/MyReports.jsx';
import MapView from './pages/MapView.jsx';
import Alerts from './pages/Alerts.jsx';
import Navbar from './components/Navbar.jsx';

const isAuthed = () => !!localStorage.getItem('token');

const Protected = ({ children }) => (isAuthed() ? children : <Navigate to="/login" />);

function App() {
  const showNav = isAuthed();
  return (
    <div className="min-h-screen pb-20 max-w-md mx-auto">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Protected><Home /></Protected>} />
        <Route path="/report" element={<Protected><Report /></Protected>} />
        <Route path="/my-reports" element={<Protected><MyReports /></Protected>} />
        <Route path="/map" element={<Protected><MapView /></Protected>} />
        <Route path="/alerts" element={<Protected><Alerts /></Protected>} />
      </Routes>
      {showNav && <Navbar />}
    </div>
  );
}

export default App;
