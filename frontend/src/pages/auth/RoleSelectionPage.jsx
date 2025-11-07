import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, User, Heart, MapPin, ArrowRight, Check } from 'lucide-react';

const RoleSelectionPage = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);

  const roles = [
    {
      id: 'team',
      title: 'Équipe',
      icon: Users,
      description: 'Inscrivez votre équipe et réservez des terrains',
      features: [
        'Gérer les membres',
        'Réserver des terrains',
        'Organiser des matchs',
        'Suivre les statistiques'
      ],
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      hoverColor: 'hover:border-blue-500',
      iconColor: 'text-blue-600'
    },
    {
      id: 'player',
      title: 'Joueur',
      icon: User,
      description: 'Trouvez une équipe et participez à des matchs',
      features: [
        'Créer votre profil',
        'Rejoindre des équipes',
        'Trouver des matchs',
        'Statistiques personnelles'
      ],
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      hoverColor: 'hover:border-green-500',
      iconColor: 'text-green-600'
    },
    {
      id: 'subscriber',
      title: 'Entreprise / Abonné',
      icon: Heart,
      description: 'Abonnement mensuel pour matchs réguliers',
      features: [
        'Réservations récurrentes',
        'Matchs hebdomadaires',
        'Facturation mensuelle',
        'Gestion d\'équipe entreprise'
      ],
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      hoverColor: 'hover:border-purple-500',
      iconColor: 'text-purple-600'
    },
    {
      id: 'owner',
      title: 'Propriétaire',
      icon: MapPin,
      description: 'Proposez vos terrains à la location',
      features: [
        'Gérer vos terrains',
        'Recevoir des réservations',
        'Suivre vos revenus',
        'Statistiques détaillées'
      ],
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      hoverColor: 'hover:border-orange-500',
      iconColor: 'text-orange-600'
    }
  ];

  const handleContinue = () => {
    if (selectedRole) {
      // Sauvegarder le rôle choisi dans localStorage
      localStorage.setItem('selectedRole', selectedRole);
      console.log('🎯 Rôle choisi et sauvegardé:', selectedRole);
      
      // Rediriger vers la page de login avec l'onglet inscription ouvert
      navigate('/login?from=role-selection&tab=register');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl mb-6">
            <span className="text-white font-bold text-2xl">221</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Rejoignez-nous
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choisissez le type de compte qui correspond le mieux à vos besoins
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-8">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;

            return (
              <div
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`relative bg-white rounded-3xl p-8 cursor-pointer transition-all duration-300 border-2 ${
                  isSelected
                    ? 'border-green-500 shadow-2xl scale-105'
                    : `border-gray-200 ${role.hoverColor} hover:shadow-xl`
                }`}
              >
                {/* Badge sélectionné */}
                {isSelected && (
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                    <Check className="text-white" size={20} />
                  </div>
                )}

                {/* Icône */}
                <div className={`inline-flex items-center justify-center w-16 h-16 ${role.bgColor} rounded-2xl mb-6`}>
                  <Icon className={role.iconColor} size={32} />
                </div>

                {/* Titre */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {role.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-6">
                  {role.description}
                </p>

                {/* Features */}
                <ul className="space-y-3">
                  {role.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-700">
                      <div className={`w-5 h-5 rounded-full ${role.bgColor} flex items-center justify-center mr-3 flex-shrink-0`}>
                        <Check className={role.iconColor} size={12} />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Bouton Continuer */}
        <div className="text-center">
          <button
            onClick={handleContinue}
            disabled={!selectedRole}
            className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 ${
              selectedRole
                ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-xl hover:shadow-2xl hover:scale-105'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Continuer
            <ArrowRight size={20} />
          </button>

          {/* Lien connexion */}
          <p className="text-gray-600 mt-6">
            Vous avez déjà un compte ?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-green-600 hover:text-green-700 font-semibold hover:underline"
            >
              Se connecter
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;

