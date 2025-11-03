import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { MapPin, Navigation } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix pour les icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Icône verte personnalisée
const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const SingleTerrainMap = ({ terrain }) => {
  // Récupérer les coordonnées du terrain
  const coords = terrain.address?.coordinates?.coordinates;
  
  if (!coords || coords.length !== 2) {
    return (
      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-500">
          <MapPin size={48} className="mx-auto mb-2 opacity-30" />
          <p className="text-sm">Coordonnées non disponibles</p>
        </div>
      </div>
    );
  }

  const [lng, lat] = coords;
  const center = [lat, lng];

  // Ouvrir Google Maps avec itinéraire
  const handleOpenDirections = () => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      '_blank'
    );
  };

  return (
    <div className="relative">
      <MapContainer
        center={center}
        zoom={15}
        style={{ height: '350px', width: '100%', borderRadius: '12px' }}
        scrollWheelZoom={false}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <Marker position={center} icon={greenIcon}>
          <Popup>
            <div className="p-2 min-w-[200px]">
              <h3 className="font-bold text-base mb-2">{terrain.name}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <MapPin size={14} />
                <span>{terrain.address.city}, {terrain.address.region}</span>
              </div>
              <button
                onClick={handleOpenDirections}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
              >
                <Navigation size={14} />
                Itinéraire
              </button>
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Bouton Itinéraire en Overlay */}
      <button
        onClick={handleOpenDirections}
        className="absolute top-4 right-4 bg-white hover:bg-gray-50 shadow-lg rounded-lg px-4 py-2 z-[1000] flex items-center gap-2 font-medium text-sm text-gray-700 border border-gray-200 transition"
      >
        <Navigation size={16} className="text-blue-600" />
        Itinéraire
      </button>

      {/* Badge Adresse */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm shadow-lg rounded-lg px-3 py-2 z-[1000] max-w-[calc(100%-8rem)]">
        <div className="flex items-start gap-2">
          <MapPin size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-semibold text-gray-900">{terrain.name}</p>
            <p className="text-gray-600">
              {terrain.address.street && `${terrain.address.street}, `}
              {terrain.address.city}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleTerrainMap;

