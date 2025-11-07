import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ArrowLeft, Mail, Phone, Lock, MapPin, Calendar, Activity, Navigation } from 'lucide-react';
import axios from 'axios';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

const RegisterPlayerPage = () => {
  const navigate = useNavigate();
  const { success: showSuccess, error: showError } = useToast();
  const { loginWithToken, user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    position: 'milieu',
    preferredFoot: 'droit',
    dateOfBirth: '',
    height: '',
    weight: '',
    city: '',
    region: '',
    address: '',
    postalCode: '',
    latitude: null,
    longitude: null,
    level: 'intermédiaire',
    yearsOfExperience: 0,
    lookingForTeam: false,
    bio: ''
  });

  const [loadingLocation, setLoadingLocation] = useState(false);

  // Pré-remplir avec les données du user + restaurer brouillon
  useEffect(() => {
    if (user) {
      const savedDraft = localStorage.getItem('playerFormDraft');
      
      if (savedDraft) {
        try {
          const draft = JSON.parse(savedDraft);
          console.log('📝 Brouillon joueur trouvé');
          setFormData({
            ...draft,
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            phone: user.phone || '',
            password: 'already-set',
            confirmPassword: 'already-set'
          });
        } catch (e) {
          console.error('Erreur lecture brouillon:', e);
        }
      } else {
        setFormData(prev => ({
          ...prev,
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          phone: user.phone || '',
          password: 'already-set',
          confirmPassword: 'already-set'
        }));
      }
    }
  }, [user]);

  // Sauvegarder brouillon
  useEffect(() => {
    if (formData.position || formData.city || formData.dateOfBirth) {
      const draft = {
        position: formData.position,
        preferredFoot: formData.preferredFoot,
        dateOfBirth: formData.dateOfBirth,
        height: formData.height,
        weight: formData.weight,
        city: formData.city,
        region: formData.region,
        level: formData.level,
        yearsOfExperience: formData.yearsOfExperience,
        lookingForTeam: formData.lookingForTeam,
        bio: formData.bio
      };
      localStorage.setItem('playerFormDraft', JSON.stringify(draft));
    }
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Géolocalisation automatique
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      showError('La géolocalisation n\'est pas supportée par votre navigateur');
      return;
    }

    setLoadingLocation(true);
    showSuccess('📍 Récupération de votre position...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log('📍 Position:', { latitude, longitude });

        try {
          // Utiliser l'API de reverse geocoding (Nominatim - OpenStreetMap)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=fr`
          );
          const data = await response.json();

          console.log('🗺️ Données de localisation:', data);

          // Extraire ville et région
          const city = data.address.city || data.address.town || data.address.village || data.address.county || '';
          const region = data.address.state || data.address.region || '';
          const address = `${data.address.road || ''} ${data.address.house_number || ''}`.trim();
          const postalCode = data.address.postcode || '';

          setFormData(prev => ({
            ...prev,
            city: city,
            region: region,
            address: address || prev.address,
            postalCode: postalCode || prev.postalCode,
            latitude: latitude.toString(),
            longitude: longitude.toString()
          }));

          showSuccess('✅ Position détectée avec succès !');
        } catch (error) {
          console.error('Erreur géolocalisation:', error);
          showError('Impossible de récupérer l\'adresse exacte');
        } finally {
          setLoadingLocation(false);
        }
      },
      (error) => {
        console.error('Erreur géolocalisation:', error);
        setLoadingLocation(false);
        
        if (error.code === error.PERMISSION_DENIED) {
          showError('Vous devez autoriser l\'accès à votre position');
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          showError('Position indisponible');
        } else {
          showError('Erreur lors de la géolocalisation');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      showError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 6) {
      showError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...dataToSend } = formData;
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/multi-auth/register/player`,
        dataToSend
      );

      if (response.data.success) {
        // Nettoyer brouillon et rôle
        localStorage.removeItem('playerFormDraft');
        localStorage.removeItem('selectedRole');
        
        // Connecter automatiquement l'utilisateur
        const { token, player } = response.data.data;
        loginWithToken(token, player);
        
        showSuccess('Inscription réussie ! Bienvenue !');
        navigate('/dashboard/player');
      }
    } catch (error) {
      console.error('Erreur inscription joueur:', error);
      showError(error.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/role-selection')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            Retour
          </button>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
              <User className="text-green-600" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Inscription Joueur
              </h1>
              <p className="text-gray-600">
                Créez votre profil de joueur
              </p>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-8 space-y-6">
          {/* Informations Personnelles */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Informations personnelles
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  disabled={!!user}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Ibrahima"
                />
                {user && <p className="text-xs text-gray-500 mt-1">✓ Pré-rempli depuis votre compte</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  disabled={!!user}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Sy"
                />
                {user && <p className="text-xs text-gray-500 mt-1">✓ Pré-rempli depuis votre compte</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="inline mr-2" size={16} />
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={!!user}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="email@example.com"
                />
                {user && <p className="text-xs text-gray-500 mt-1">✓ Pré-rempli depuis votre compte</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="inline mr-2" size={16} />
                  Téléphone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  disabled={!!user}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="+221 77 123 45 67"
                />
                {user && <p className="text-xs text-gray-500 mt-1">✓ Pré-rempli depuis votre compte</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline mr-2" size={16} />
                  Date de naissance *
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Lock className="inline mr-2" size={16} />
                  Mot de passe *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={!!user}
                  minLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                />
                {user && <p className="text-xs text-gray-500 mt-1">✓ Utilise votre mot de passe actuel</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer le mot de passe *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={!!user}
                  minLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                />
                {user && <p className="text-xs text-gray-500 mt-1">✓ Utilise votre mot de passe actuel</p>}
              </div>
            </div>
          </div>

          {/* Informations Sportives */}
          <div className="pt-6 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              <Activity className="inline mr-2" size={24} />
              Informations sportives
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position *
                </label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="gardien">Gardien</option>
                  <option value="défenseur">Défenseur</option>
                  <option value="milieu">Milieu</option>
                  <option value="attaquant">Attaquant</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pied préféré
                </label>
                <select
                  name="preferredFoot"
                  value={formData.preferredFoot}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="droit">Droit</option>
                  <option value="gauche">Gauche</option>
                  <option value="ambidextre">Ambidextre</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Taille (cm)
                </label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  min="120"
                  max="250"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="175"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Poids (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  min="30"
                  max="200"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="70"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Niveau
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="débutant">Débutant</option>
                  <option value="intermédiaire">Intermédiaire</option>
                  <option value="avancé">Avancé</option>
                  <option value="expert">Expert</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Années d'expérience
                </label>
                <input
                  type="number"
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>

              {/* Section Localisation */}
              <div className="md:col-span-2 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <MapPin size={20} className="text-green-600" />
                    Localisation
                  </h3>
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={loadingLocation}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    <Navigation size={16} className={loadingLocation ? 'animate-spin' : ''} />
                    {loadingLocation ? 'Chargement...' : 'Localiser ma position'}
                  </button>
                </div>

                {/* Message explicatif */}
                <div className="mb-4 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    📍 Trouvez des terrains et équipes près de chez vous
                  </p>
                  <p className="text-xs text-gray-600">
                    Votre position nous aide à vous connecter avec votre communauté locale.
                    <span className="text-blue-600 font-medium"> Données 100% sécurisées.</span>
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ville *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Dakar"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Région *
                    </label>
                    <input
                      type="text"
                      name="region"
                      value={formData.region}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Dakar"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adresse
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Rue 10, Médina"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Code postal
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="11000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Latitude
                    </label>
                    <input
                      type="text"
                      name="latitude"
                      value={formData.latitude || ''}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 cursor-not-allowed text-gray-600"
                      placeholder="Auto"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Longitude
                    </label>
                    <input
                      type="text"
                      name="longitude"
                      value={formData.longitude || ''}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 cursor-not-allowed text-gray-600"
                      placeholder="Auto"
                    />
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                  maxLength={300}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Parlez-nous de vous..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="lookingForTeam"
                    checked={formData.lookingForTeam}
                    onChange={handleChange}
                    className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">
                    Je recherche une équipe
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Boutons */}
          <div className="pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold px-8 py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Inscription en cours...' : 'Créer mon profil'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPlayerPage;

