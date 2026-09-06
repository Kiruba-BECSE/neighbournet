import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import api from '../api.js';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

export default function MapView() {
  const [points, setPoints] = useState([]);

  useEffect(() => {
    api.get('/grievances/map').then((res) => setPoints(res.data)).catch(() => {});
  }, []);

  const center = points.length
    ? [points[0].location.coordinates[1], points[0].location.coordinates[0]]
    : [11.0168, 76.9558]; // Coimbatore fallback

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold mb-4">Issue map</h1>
      <div className="rounded-xl overflow-hidden" style={{ height: '70vh' }}>
        <MapContainer center={center} zoom={14} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {points.map((p) => (
            <Marker key={p._id} position={[p.location.coordinates[1], p.location.coordinates[0]]}>
              <Popup>
                <b>{p.grievanceId}</b><br />
                {p.category} — {p.status}<br />
                Severity: {p.severity}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}