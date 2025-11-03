import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Mail, Lock, User, Phone } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

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
  
  const { register } = useAuth();
  const { success: showSuccess, error: showError } = useToast();
  const navigate = useNavigate();

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
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      showError(err.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Inscription</h2>
          <p className="mt-2 text-gray-600">Créez votre compte gratuitement</p>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Prénom"
                type="text"
                name="firstName"
                icon={User}
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <Input
                label="Nom"
                type="text"
                name="lastName"
                icon={User}
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <Input
              label="Email"
              type="email"
              name="email"
              icon={Mail}
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Input
              label="Téléphone"
              type="tel"
              name="phone"
              icon={Phone}
              value={formData.phone}
              onChange={handleChange}
              placeholder="+221771234567"
              required
            />

            <Input
              label="Mot de passe"
              type="password"
              name="password"
              icon={Lock}
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de compte
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="client">Client / Joueur</option>
                <option value="owner">Propriétaire de terrain</option>
                <option value="team">Capitaine d'équipe</option>
              </select>
            </div>

            {/* Champ conditionnel pour les propriétaires */}
            {formData.role === 'owner' && (
              <Input
                label="Nom de l'entreprise"
                type="text"
                name="businessName"
                icon={User}
                value={formData.businessName}
                onChange={handleChange}
                placeholder="Ex: Galaxy Arena, Le Temple du Foot..."
                required
              />
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Inscription...' : 'S\'inscrire'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Déjà un compte ?{' '}
              <Link to="/login" className="text-primary-600 hover:underline font-medium">
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

