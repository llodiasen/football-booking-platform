import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, DollarSign } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix pour les icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Créer icône personnalisée verte
const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Composant pour recentrer la carte
const RecenterMap = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
};

const MapView = ({ terrains, userLocation }) => {
  const navigate = useNavigate();
  const [mapCenter, setMapCenter] = useState(userLocation || [14.7167, -17.4677]); // Dakar par défaut
  const [mapKey, setMapKey] = useState(0); // Clé pour forcer le re-render

  useEffect(() => {
    if (userLocation) {
      setMapCenter(userLocation);
      setMapKey(prev => prev + 1); // Forcer le re-render
    } else if (terrains.length > 0) {
      // Centrer sur le premier terrain
      const firstTerrain = terrains[0];
      if (firstTerrain.address?.coordinates?.coordinates) {
        const [lng, lat] = firstTerrain.address.coordinates.coordinates;
        setMapCenter([lat, lng]);
        setMapKey(prev => prev + 1); // Forcer le re-render
      }
    }
  }, [userLocation, terrains]);

  return (
    <div className="h-full relative">
      <MapContainer
        key={mapKey}
        center={mapCenter}
        zoom={userLocation ? 13 : 12}
        style={{ height: '100%', width: '100%', borderRadius: '12px' }}
        scrollWheelZoom={true}
      >
        {/* Carte moderne style Google Maps (CartoDB Voyager) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        <RecenterMap center={mapCenter} />

        {/* Marker pour position utilisateur */}
        {userLocation && (
          <Marker position={userLocation}>
            <Popup>
              <div className="p-2 text-center">
                <MapPin className="text-blue-600 mx-auto mb-1" size={20} />
                <p className="font-semibold">Vous êtes ici</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Markers pour terrains */}
        {terrains.map(terrain => {
          const coords = terrain.address?.coordinates?.coordinates;
          if (!coords || coords.length !== 2) return null;
          
          const [lng, lat] = coords;
          
          return (
            <Marker
              key={terrain._id}
              position={[lat, lng]}
              icon={greenIcon}
            >
              <Popup>
                <div className="w-64">
                  {/* Image */}
                  {terrain.images?.[0]?.url && (
                    <img
                      src={terrain.images[0].url}
                      alt={terrain.name}
                      className="w-full h-32 object-cover rounded-lg mb-2"
                    />
                  )}
                  
                  {/* Info */}
                  <h3 className="font-bold text-lg mb-1">{terrain.name}</h3>
                  
                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <MapPin size={14} className="mr-1" />
                    <span>{terrain.address.city}, {terrain.address.region}</span>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Star size={14} className="text-yellow-400 fill-current mr-1" />
                      <span className="text-sm font-medium">
                        {terrain.rating?.average?.toFixed(1) || 'N/A'}
                      </span>
                    </div>
                    <span className="text-sm bg-primary-100 text-primary-700 px-2 py-1 rounded">
                      {terrain.size}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-primary-600">
                      {terrain.pricePerHour?.toLocaleString()} FCFA/h
                    </span>
                  </div>

                  <button
                    onClick={() => navigate(`/terrains/${terrain._id}`)}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg font-medium transition"
                  >
                    Voir détails
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Message si pas de terrains */}
      {terrains.length === 0 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg z-[1000] text-center">
          <div className="text-4xl mb-3">⚽</div>
          <h3 className="font-bold text-lg mb-2">Aucun terrain sur la carte</h3>
          <p className="text-sm text-gray-600">Essayez de modifier vos filtres</p>
        </div>
      )}

      {/* Légende */}
      <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-md z-[1000]">
        <p className="text-xs font-bold mb-2">Légende</p>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            <span>Terrain ({terrains.length})</span>
          </div>
          {userLocation && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <span>Votre position</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapView;

