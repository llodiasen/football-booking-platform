import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ArrowLeft, Upload, Mail, Phone, Lock, MapPin, Calendar, Navigation } from 'lucide-react';
import axios from 'axios';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

const RegisterTeamPage = () => {
  const navigate = useNavigate();
  const { success: showSuccess, error: showError } = useToast();
  const { loginWithToken, user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    // Équipe
    name: '',
    logo: '',
    logoFile: null,
    description: '',
    category: 'amateur',
    matchType: '11v11', // 11 vs 11, 7 vs 7, 5 vs 5
    homeTerrain: '', // Terrain de domicile
    city: '',
    region: '',
    address: '',
    postalCode: '',
    latitude: '',
    longitude: '',
    foundedYear: new Date().getFullYear(),
    // Capitaine (sera pré-rempli avec les données du user connecté)
    captain: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    }
  });

  const [logoPreview, setLogoPreview] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [availableTerrains, setAvailableTerrains] = useState([]);
  const [loadingTerrains, setLoadingTerrains] = useState(false);

  // Pré-remplir les infos du capitaine avec les données de l'utilisateur connecté
  useEffect(() => {
    if (user) {
      // Vérifier si un brouillon existe dans localStorage
      const savedDraft = localStorage.getItem('teamFormDraft');
      
      if (savedDraft) {
        try {
          const draft = JSON.parse(savedDraft);
          console.log('📝 Brouillon trouvé, restauration...');
          setFormData({
            ...draft,
            captain: {
              firstName: user.firstName || '',
              lastName: user.lastName || '',
              email: user.email || '',
              phone: user.phone || '',
              password: 'already-set',
              confirmPassword: 'already-set'
            }
          });
        } catch (e) {
          console.error('Erreur lecture brouillon:', e);
        }
      } else {
        // Pas de brouillon, pré-remplir normalement
        setFormData(prev => ({
          ...prev,
          captain: {
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            phone: user.phone || '',
            password: 'already-set',
            confirmPassword: 'already-set'
          }
        }));
      }
    }
  }, [user]);

  // Charger la liste des terrains disponibles
  useEffect(() => {
    const loadTerrains = async () => {
      if (!formData.city) return; // Attendre que la ville soit remplie
      
      setLoadingTerrains(true);
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await axios.get(`${apiUrl}/terrains`, {
          params: {
            city: formData.city,
            limit: 50
          }
        });
        
        if (response.data.success) {
          setAvailableTerrains(response.data.data || []);
          console.log('✅ Terrains chargés:', response.data.data.length);
        }
      } catch (error) {
        console.error('Erreur chargement terrains:', error);
      } finally {
        setLoadingTerrains(false);
      }
    };

    loadTerrains();
  }, [formData.city]);

  // Sauvegarder le brouillon à chaque modification
  useEffect(() => {
    if (formData.name || formData.description || formData.city || formData.region) {
      const draft = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        matchType: formData.matchType,
        homeTerrain: formData.homeTerrain,
        city: formData.city,
        region: formData.region,
        address: formData.address,
        postalCode: formData.postalCode,
        foundedYear: formData.foundedYear
      };
      localStorage.setItem('teamFormDraft', JSON.stringify(draft));
      console.log('💾 Brouillon sauvegardé');
    }
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('captain.')) {
      const captainField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        captain: {
          ...prev.captain,
          [captainField]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showError('L\'image ne doit pas dépasser 5MB');
        return;
      }

      // Vérifier le type
      if (!file.type.startsWith('image/')) {
        showError('Le fichier doit être une image');
        return;
      }

      // Créer une preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
        setFormData(prev => ({ ...prev, logo: reader.result, logoFile: file }));
      };
      reader.readAsDataURL(file);
    }
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
    if (formData.captain.password !== formData.captain.confirmPassword) {
      showError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.captain.password.length < 6) {
      showError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/multi-auth/register/team`,
        formData
      );

      if (response.data.success) {
        console.log('✅ Inscription réussie, données reçues:', response.data.data);
        
        // Nettoyer le brouillon et le rôle sélectionné
        localStorage.removeItem('teamFormDraft');
        localStorage.removeItem('selectedRole');
        console.log('🧹 Brouillon et selectedRole nettoyés');
        
        // Connecter automatiquement l'utilisateur
        const { token, team } = response.data.data;
        console.log('🔑 Token:', token);
        console.log('👥 Team:', team);
        console.log('🎯 Role de l\'équipe:', team?.role);
        
        loginWithToken(token, team);
        console.log('✅ loginWithToken appelé');
        
        showSuccess('Équipe créée avec succès ! Bienvenue !');
        
        console.log('🚀 Navigation vers /dashboard/team...');
        navigate('/dashboard/team');
      }
    } catch (error) {
      console.error('Erreur inscription équipe:', error);
      showError(error.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
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
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
              <Users className="text-blue-600" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Inscription Équipe
              </h1>
              <p className="text-gray-600">
                Créez votre équipe et commencez à jouer
              </p>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-8 space-y-6">
          {/* Informations Équipe */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Informations de l'équipe
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de l'équipe *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="FC Dragons"
                />
              </div>

              {/* Upload Logo */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo de l'équipe
                </label>
                <div className="flex items-center gap-4">
                  {logoPreview && (
                    <img 
                      src={logoPreview} 
                      alt="Logo preview" 
                      className="w-20 h-20 rounded-xl object-cover border-2 border-blue-200"
                    />
                  )}
                  <label className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 transition-all">
                      <Upload size={20} className="text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {logoPreview ? 'Changer le logo' : 'Télécharger le logo'}
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">Format: JPG, PNG. Max 5MB.</p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Décrivez votre équipe..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="amateur">Amateur</option>
                  <option value="semi-pro">Semi-Professionnel</option>
                  <option value="professionnel">Professionnel</option>
                  <option value="loisir">Loisir</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de match *
                </label>
                <select
                  name="matchType"
                  value={formData.matchType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="11v11">⚽ Football 11 vs 11</option>
                  <option value="7v7">⚽ Football 7 vs 7</option>
                  <option value="5v5">⚽ Futsal 5 vs 5</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Année de création
                </label>
                <input
                  type="number"
                  name="foundedYear"
                  value={formData.foundedYear}
                  onChange={handleChange}
                  min="1900"
                  max={new Date().getFullYear()}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Terrain de domicile */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🏟️ Terrain de domicile (optionnel)
                </label>
                {loadingTerrains ? (
                  <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-sm text-gray-600">Chargement des terrains...</span>
                  </div>
                ) : availableTerrains.length > 0 ? (
                  <select
                    name="homeTerrain"
                    value={formData.homeTerrain}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Aucun terrain sélectionné</option>
                    {availableTerrains.map((terrain) => (
                      <option key={terrain._id} value={terrain._id}>
                        {terrain.name} - {terrain.address?.city} ({terrain.pricePerHour} FCFA/h)
                      </option>
                    ))}
                  </select>
                ) : formData.city ? (
                  <div className="px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <p className="text-sm text-yellow-800">
                      Aucun terrain trouvé dans votre ville. Vous pourrez en choisir un plus tard.
                    </p>
                  </div>
                ) : (
                  <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl">
                    <p className="text-sm text-gray-600">
                      Remplissez d'abord la ville pour voir les terrains disponibles
                    </p>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Choisissez votre terrain habituel. Vous recevrez des notifications pour les disponibilités.
                </p>
              </div>
            </div>
          </div>

          {/* Localisation */}
          <div className="pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-gray-900">
                <MapPin className="inline mr-2" size={24} />
                Localisation
              </h2>
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={loadingLocation}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Navigation size={16} className={loadingLocation ? 'animate-spin' : ''} />
                {loadingLocation ? 'Chargement...' : 'Utiliser ma position'}
              </button>
            </div>

            {/* Message explicatif */}
            <div className="mb-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-900 mb-2">
                <strong>🔒 Pourquoi votre localisation ?</strong>
              </p>
              <ul className="text-xs text-blue-800 space-y-1.5 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Vous proposer des <strong>terrains proches</strong> de chez vous</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Trouver des <strong>adversaires dans votre région</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Recevoir des <strong>notifications pour les matchs locaux</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Organiser des <strong>tournois dans votre ville</strong></span>
                </li>
              </ul>
              <p className="text-xs text-blue-700 mt-3 italic">
                🔐 Vos données sont sécurisées et ne seront jamais partagées sans votre consentement.
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="123 Rue de la Liberté"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="11000"
                />
              </div>

              {/* Coordonnées GPS */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Latitude
                </label>
                <input
                  type="text"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                  placeholder="14.6928"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Longitude
                </label>
                <input
                  type="text"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                  placeholder="-17.4467"
                  readOnly
                />
              </div>

              {formData.latitude && formData.longitude && (
                <div className="md:col-span-2">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <p className="text-sm text-green-800">
                      📍 Position GPS enregistrée : {formData.latitude}, {formData.longitude}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Informations Capitaine - Pré-remplies et désactivées */}
          <div className="pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Informations du capitaine
              </h2>
              <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                ✅ Déjà remplies
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Ces informations proviennent de votre compte. Vous êtes le capitaine de l'équipe.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom
                </label>
                <input
                  type="text"
                  value={formData.captain.firstName}
                  disabled
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  value={formData.captain.lastName}
                  disabled
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="inline mr-2" size={16} />
                  Email
                </label>
                <input
                  type="email"
                  value={formData.captain.email}
                  disabled
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="inline mr-2" size={16} />
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={formData.captain.phone}
                  disabled
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
                />
              </div>

              <div className="md:col-span-2">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm text-blue-800">
                    <Lock className="inline mr-2" size={16} />
                    Votre mot de passe est déjà défini lors de la création de votre compte.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Boutons */}
          <div className="pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Création en cours...' : 'Créer mon équipe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterTeamPage;

