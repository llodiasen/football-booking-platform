import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ArrowLeft, Upload, Mail, Phone, Lock, MapPin, Calendar, Navigation, Search, X } from 'lucide-react';
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
  const [terrainSearch, setTerrainSearch] = useState('');
  const [showTerrainDropdown, setShowTerrainDropdown] = useState(false);

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
    
    setLoading(true);
    try {
      // Si l'utilisateur est déjà connecté, ne pas envoyer le mot de passe
      // Le capitaine = l'utilisateur connecté
      const dataToSend = {
        ...formData,
        captain: {
          firstName: user?.firstName || formData.captain.firstName,
          lastName: user?.lastName || formData.captain.lastName,
          email: user?.email || formData.captain.email,
          phone: user?.phone || formData.captain.phone,
          password: user ? 'existing-user' : formData.captain.password // Mot de passe fictif si user existe
        }
      };

      console.log('📤 Envoi données équipe:', dataToSend);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/multi-auth/register/team`,
        dataToSend
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
        
        // Vérifier s'il y a une action en attente (invitation de joueur)
        const pendingAction = localStorage.getItem('pendingAction');
        if (pendingAction) {
          try {
            const action = JSON.parse(pendingAction);
            if (action.type === 'invite_player' && action.returnUrl) {
              // Nettoyer l'action
              localStorage.removeItem('pendingAction');
              
              // Message informatif
              setTimeout(() => {
                showSuccess(`Vous pouvez maintenant inviter ${action.playerName} !`);
              }, 1500);
              
              // Rediriger vers la page du joueur
              console.log(`🔄 Redirection vers ${action.returnUrl} pour inviter ${action.playerName}`);
              setTimeout(() => {
                navigate(action.returnUrl);
              }, 2000);
              return;
            }
          } catch (error) {
            console.error('Erreur parsing pendingAction:', error);
          }
        }
        
        // Redirection normale vers le dashboard d'équipe
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

              {/* Terrain de domicile - Autocomplétion */}
              <div className="md:col-span-2 relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🏟️ Terrain de domicile (optionnel)
                </label>
                
                {loadingTerrains ? (
                  <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl border border-gray-300">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-sm text-gray-600">Chargement des terrains...</span>
                  </div>
                ) : availableTerrains.length > 0 ? (
                  <>
                    {/* Input de recherche avec autocomplete */}
                    <div className="relative">
                      <input
                        type="text"
                        value={terrainSearch}
                        onChange={(e) => {
                          setTerrainSearch(e.target.value);
                          setShowTerrainDropdown(true);
                        }}
                        onFocus={() => setShowTerrainDropdown(true)}
                        placeholder="Rechercher un terrain (ex: Stade Médina, Terrain Yoff...)"
                        className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>

                    {/* Dropdown d'autocomplétion */}
                    {showTerrainDropdown && terrainSearch && (
                      <>
                        {/* Overlay pour fermer */}
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setShowTerrainDropdown(false)}
                        />
                        
                        {/* Liste des suggestions */}
                        <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-80 overflow-y-auto">
                          {availableTerrains
                            .filter(terrain => 
                              terrain.name.toLowerCase().includes(terrainSearch.toLowerCase()) ||
                              terrain.address?.city?.toLowerCase().includes(terrainSearch.toLowerCase())
                            )
                            .slice(0, 10)
                            .map((terrain) => (
                              <button
                                key={terrain._id}
                                type="button"
                                onClick={() => {
                                  setFormData(prev => ({ ...prev, homeTerrain: terrain._id }));
                                  setTerrainSearch(`${terrain.name} - ${terrain.address?.city}`);
                                  setShowTerrainDropdown(false);
                                }}
                                className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-0"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <MapPin className="text-blue-600" size={18} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-900 truncate">{terrain.name}</p>
                                    <p className="text-sm text-gray-600">
                                      📍 {terrain.address?.city} • {terrain.pricePerHour?.toLocaleString()} FCFA/h
                                    </p>
                                  </div>
                                </div>
                              </button>
                            ))}
                          
                          {availableTerrains.filter(t => 
                            t.name.toLowerCase().includes(terrainSearch.toLowerCase()) ||
                            t.address?.city?.toLowerCase().includes(terrainSearch.toLowerCase())
                          ).length === 0 && (
                            <div className="px-4 py-8 text-center text-gray-500">
                              <Search className="mx-auto mb-2" size={32} />
                              <p className="text-sm">Aucun terrain trouvé pour "{terrainSearch}"</p>
                            </div>
                          )}
                        </div>
                      </>
                    )}

                    {/* Terrain sélectionné */}
                    {formData.homeTerrain && !showTerrainDropdown && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                            <MapPin className="text-white" size={16} />
                          </div>
                          <span className="text-sm font-medium text-green-900">
                            {availableTerrains.find(t => t._id === formData.homeTerrain)?.name || terrainSearch}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, homeTerrain: '' }));
                            setTerrainSearch('');
                          }}
                          className="text-red-600 hover:text-red-700 p-1"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    )}
                  </>
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

            {/* Message explicatif smart */}
            <div className="mb-4 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm font-medium text-gray-900 mb-2">
                📍 Trouvez des terrains et adversaires près de chez vous
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

