import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { terrainAPI } from '../services/api';
import { MapPin, Star, DollarSign } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const TerrainDetails = () => {
  const { id } = useParams();
  const [terrain, setTerrain] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTerrain();
  }, [id]);

  const loadTerrain = async () => {
    try {
      const response = await terrainAPI.getOne(id);
      setTerrain(response.data.data);
    } catch (error) {
      console.error('Error loading terrain:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container-custom py-12 text-center">Chargement...</div>;
  }

  if (!terrain) {
    return <div className="container-custom py-12 text-center">Terrain non trouvé</div>;
  }

  return (
    <div className="container-custom py-12">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="h-96 bg-gray-200 rounded-lg mb-6">
            {terrain.images?.[0]?.url ? (
              <img src={terrain.images[0].url} alt={terrain.name} className="w-full h-full object-cover rounded-lg" />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">Pas d'image</div>
            )}
          </div>

          <h1 className="text-3xl font-bold mb-4">{terrain.name}</h1>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center">
              <MapPin size={20} className="text-gray-500 mr-2" />
              <span>{terrain.address.city}, {terrain.address.region}</span>
            </div>
            <div className="flex items-center">
              <Star size={20} className="text-yellow-400 fill-current mr-1" />
              <span>{terrain.rating?.average?.toFixed(1) || 'N/A'} ({terrain.rating?.count || 0} avis)</span>
            </div>
          </div>

          <Card className="p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Description</h2>
            <p className="text-gray-600">{terrain.description}</p>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Équipements</h2>
            <div className="flex flex-wrap gap-2">
              {terrain.amenities?.map((amenity, index) => (
                <span key={index} className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm">
                  {amenity}
                </span>
              ))}
            </div>
          </Card>
        </div>

        <div>
          <Card className="p-6 sticky top-20">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-3xl font-bold text-primary-600">
                  {terrain.pricePerHour.toLocaleString()} FCFA
                </div>
                <div className="text-gray-500 text-sm">par heure</div>
              </div>
            </div>

            <Link to={`/booking/${terrain._id}`}>
              <Button className="w-full mb-4">
                Réserver maintenant
              </Button>
            </Link>

            <div className="text-sm text-gray-500 text-center">
              Confirmation instantanée
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TerrainDetails;

