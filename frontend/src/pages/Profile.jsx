import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="container-custom py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Mon Profil</h1>

        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">Nom complet</label>
              <p className="text-lg font-medium">{user?.firstName} {user?.lastName}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Email</label>
              <p className="text-lg font-medium">{user?.email}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Téléphone</label>
              <p className="text-lg font-medium">{user?.phone}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Rôle</label>
              <p className="text-lg font-medium capitalize">{user?.role}</p>
            </div>
            
            <div className="pt-4">
              <Button>Modifier le profil</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;

