import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    role: 'client',
    businessName: ''
  });
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  
  const { register } = useAuth();
  const { success: showSuccess, error: showError } = useToast();
  const navigate = useNavigate();

  // Récupérer l'URL de redirection si présente
  const redirectUrl = searchParams.get('redirect');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Préparer les données selon le rôle
      const dataToSend = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role
      };

      // Ajouter ownerProfile si c'est un propriétaire
      if (formData.role === 'owner' && formData.businessName) {
        dataToSend.ownerProfile = {
          businessName: formData.businessName
        };
      }

      const result = await register(dataToSend);
      showSuccess(result.message || 'Inscription réussie! 🎉');
      
      // Rediriger vers l'URL de redirection ou vers le dashboard par défaut
      setTimeout(() => {
        if (redirectUrl) {
          navigate(redirectUrl);
        } else {
          navigate('/dashboard');
        }
      }, 2000);
    } catch (err) {
      showError(err.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Créer un compte
            </h1>
            <p className="text-sm text-gray-600">
              Inscrivez-vous gratuitement
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nom et Prénom */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium text-gray-900">
                  Prénom
                </label>
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  placeholder="Ali"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium text-gray-900">
                  Nom
                </label>
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  placeholder="Ndiaye"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-900">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="m@exemple.com"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
              />
            </div>

            {/* Téléphone */}
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-gray-900">
                Téléphone
              </label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="77 123 45 67"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
              />
            </div>

            {/* Mot de passe */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-900">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
              />
              <p className="text-xs text-gray-500">Minimum 6 caractères</p>
            </div>

            {/* Type de compte */}
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium text-gray-900">
                Type de compte
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
              >
                <option value="client">🎮 Client / Joueur</option>
                <option value="owner">🏟️ Propriétaire de terrain</option>
                <option value="team">⚽ Capitaine d'équipe</option>
              </select>
            </div>

            {/* Nom entreprise pour propriétaires */}
            {formData.role === 'owner' && (
              <div className="space-y-2">
                <label htmlFor="businessName" className="text-sm font-medium text-gray-900">
                  Nom de l'entreprise
                </label>
                <input
                  id="businessName"
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Galaxy Arena"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-xl transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? 'Inscription...' : 'S\'inscrire'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Déjà un compte ?{' '}
              <Link 
                to={redirectUrl ? `/login?redirect=${encodeURIComponent(redirectUrl)}` : '/login'} 
                className="text-gray-900 hover:underline font-semibold"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

