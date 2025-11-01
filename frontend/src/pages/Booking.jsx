import { useParams } from 'react-router-dom';

const Booking = () => {
  const { terrainId } = useParams();
  
  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl font-bold mb-8">Réserver un terrain</h1>
      <div className="text-center py-12 text-gray-500">
        Formulaire de réservation pour le terrain {terrainId}
      </div>
    </div>
  );
};

export default Booking;

