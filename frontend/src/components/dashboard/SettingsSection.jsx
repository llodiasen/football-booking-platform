import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { authAPI } from '../../services/api';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Camera,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';

const SettingsSection = () => {
  const { user, updateUser } = useAuth();
  const { success: showSuccess, error: showError } = useToast();
  
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profileImage, setProfileImage] = useState(user?.avatar || null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Vérifier le type et la taille
    if (!file.type.startsWith('image/')) {
      showError('Veuillez sélectionner une image');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showError('L\'image ne doit pas dépasser 5 MB');
      return;
    }

    setUploadingImage(true);
    
    try {
      // Convertir en base64 pour prévisualisation
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
      
      // TODO: Upload vers serveur/Cloudinary
      showSuccess('Photo de profil mise à jour');
    } catch (error) {
      showError('Erreur lors de l\'upload de l\'image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSavingProfile(true);

    try {
      const response = await authAPI.updateProfile(profileData);
      updateUser(response.data.data);
      showSuccess('Profil mis à jour avec succès');
    } catch (error) {
      showError(error.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showError('Les mots de passe ne correspondent pas');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setSavingPassword(true);

    try {
      await authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      showSuccess('Mot de passe modifié avec succès');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      showError(error.response?.data?.message || 'Erreur lors de la modification');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Photo de Profil */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Photo de Profil</h3>
        
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Photo de profil"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={48} className="text-gray-400" />
              )}
            </div>
            
            {/* Bouton Camera Overlay */}
            <label 
              htmlFor="profile-image-upload"
              className="absolute bottom-0 right-0 bg-green-600 hover:bg-green-700 text-white p-3 rounded-full cursor-pointer shadow-lg transition-colors"
            >
              <Camera size={18} />
              <input
                id="profile-image-upload"
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1">
              {user?.firstName} {user?.lastName}
            </h4>
            <p className="text-sm text-gray-600 mb-4">{user?.email}</p>
            <p className="text-xs text-gray-500">
              Formats acceptés : JPG, PNG (max 5 MB)
            </p>
          </div>
        </div>
      </div>

      {/* Informations Personnelles */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Informations Personnelles</h3>
        
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prénom
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={profileData.firstName}
                  onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={profileData.lastName}
                  onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Téléphone
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={savingProfile}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            {savingProfile ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Enregistrement...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Enregistrer les modifications</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Changement de Mot de Passe */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Sécurité</h3>
        
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe actuel
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nouveau mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Minimum 6 caractères</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmer le nouveau mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={savingPassword}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            {savingPassword ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Modification...</span>
              </>
            ) : (
              <>
                <Lock size={18} />
                <span>Changer le mot de passe</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Préférences */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Préférences</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <p className="font-medium text-gray-900">Notifications par email</p>
              <p className="text-sm text-gray-600">Recevoir les notifications de réservations</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-green-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <p className="font-medium text-gray-900">Notifications SMS</p>
              <p className="text-sm text-gray-600">Recevoir des SMS pour les confirmations</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-green-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-900">Langue</p>
              <p className="text-sm text-gray-600">Sélectionnez votre langue préférée</p>
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-green-500">
              <option>Français</option>
              <option>English</option>
              <option>Wolof</option>
            </select>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-red-900 mb-2">⚠️ Zone Dangereuse</h3>
        <p className="text-sm text-red-700 mb-4">
          Les actions ci-dessous sont irréversibles. Procédez avec prudence.
        </p>
        <button className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg text-sm transition-colors">
          Supprimer mon compte
        </button>
      </div>
    </div>
  );
};

export default SettingsSection;

