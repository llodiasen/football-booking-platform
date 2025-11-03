import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authAPI } from '../services/api';
import { User, Mail, Phone, Lock, Save } from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { success: showSuccess, error: showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' ou 'password'

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.updateProfile(profileData);
      updateUser(response.data.data);
      showSuccess('Profil mis à jour avec succès ! 🎉');
    } catch (error) {
      showError(error.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showError('Les mots de passe ne correspondent pas');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    try {
      await authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      showSuccess('Mot de passe modifié avec succès ! 🎉');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      showError(error.response?.data?.message || 'Erreur lors du changement de mot de passe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* En-tête */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mon Profil</h1>
            <p className="text-gray-600">
              Gérez vos informations personnelles et paramètres
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                activeTab === 'profile'
                  ? 'bg-white text-primary-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Informations
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                activeTab === 'password'
                  ? 'bg-white text-primary-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Mot de passe
            </button>
          </div>

          {/* Onglet Profil */}
          {activeTab === 'profile' && (
            <Card className="p-8">
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    label="Prénom"
                    name="firstName"
                    icon={User}
                    value={profileData.firstName}
                    onChange={handleProfileChange}
                    required
                  />
                  <Input
                    label="Nom"
                    name="lastName"
                    icon={User}
                    value={profileData.lastName}
                    onChange={handleProfileChange}
                    required
                  />
                </div>

                <Input
                  label="Email"
                  type="email"
                  name="email"
                  icon={Mail}
                  value={profileData.email}
                  onChange={handleProfileChange}
                  required
                  disabled
                />
                <p className="text-xs text-gray-500 -mt-4">
                  L'email ne peut pas être modifié
                </p>

                <Input
                  label="Téléphone"
                  type="tel"
                  name="phone"
                  icon={Phone}
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  placeholder="+221771234567"
                  required
                />

                <div className="pt-4 border-t">
                  <Button type="submit" disabled={loading} className="w-full md:w-auto">
                    <Save size={20} className="mr-2" />
                    {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Onglet Mot de passe */}
          {activeTab === 'password' && (
            <Card className="p-8">
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <Input
                  label="Mot de passe actuel"
                  type="password"
                  name="currentPassword"
                  icon={Lock}
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />

                <Input
                  label="Nouveau mot de passe"
                  type="password"
                  name="newPassword"
                  icon={Lock}
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength={6}
                />

                <Input
                  label="Confirmer le nouveau mot de passe"
                  type="password"
                  name="confirmPassword"
                  icon={Lock}
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength={6}
                />

                <div className="pt-4 border-t">
                  <Button type="submit" disabled={loading} className="w-full md:w-auto">
                    <Lock size={20} className="mr-2" />
                    {loading ? 'Modification...' : 'Changer le mot de passe'}
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Info Compte */}
          <Card className="p-6 mt-6 bg-blue-50 border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">Informations du compte</h3>
            <div className="space-y-2 text-sm">
              <p className="text-blue-800">
                <span className="font-medium">Rôle :</span> {user?.role === 'client' ? 'Client' : user?.role === 'owner' ? 'Propriétaire' : user?.role}
              </p>
              <p className="text-blue-800">
                <span className="font-medium">Membre depuis :</span>{' '}
                {user?.createdAt && new Date(user.createdAt).toLocaleDateString('fr-FR', {
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
