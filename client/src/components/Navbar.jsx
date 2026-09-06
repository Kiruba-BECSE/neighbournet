import { NavLink } from 'react-router-dom';

const linkClass = ({ isActive }) =>
  `flex flex-col items-center text-xs ${isActive ? 'text-teal-400' : 'text-gray-400'}`;

export default function Navbar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#0f1a2b] border-t border-gray-800 flex justify-around py-3">
      <NavLink to="/" className={linkClass}>🏠<span>Home</span></NavLink>
      <NavLink to="/report" className={linkClass}>➕<span>Report</span></NavLink>
      <NavLink to="/map" className={linkClass}>🗺️<span>Map</span></NavLink>
      <NavLink to="/alerts" className={linkClass}>🔔<span>Alerts</span></NavLink>
    </div>
  );
}