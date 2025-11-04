import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { LayoutDashboard, MapPin, Calendar, DollarSign } from 'lucide-react';
import Card from '../components/ui/Card';
import OwnerDashboard from './owner/OwnerDashboard';
import AdminDashboard from './admin/AdminDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  // Dashboard Admin moderne (style Shakuro)
  if (user?.role === 'admin') {
    return <AdminDashboard />;
  }

  // Dashboard Propriétaire
  if (user?.role === 'owner') {
    return <OwnerDashboard />;
  }

  return (
    <div className="container-custom py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Bienvenue, {user?.firstName}!
        </h1>
        <p className="text-gray-600 mt-2">Voici un aperçu de votre activité</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Réservations</p>
              <p className="text-2xl font-bold">0</p>
            </div>
            <Calendar className="text-primary-600" size={32} />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Terrains</p>
              <p className="text-2xl font-bold">0</p>
            </div>
            <MapPin className="text-blue-600" size={32} />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Revenus</p>
              <p className="text-2xl font-bold">0 FCFA</p>
            </div>
            <DollarSign className="text-green-600" size={32} />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">En attente</p>
              <p className="text-2xl font-bold">0</p>
            </div>
            <LayoutDashboard className="text-orange-600" size={32} />
          </div>
        </Card>
      </div>

      {/* Rôle spécifique */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Activité récente</h2>
        <p className="text-gray-500 text-center py-8">
          Aucune activité récente
        </p>
      </Card>
    </div>
  );
};

export default Dashboard;

