import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect');
  const tabParam = searchParams.get('tab');
  
  // Ouvrir l'onglet inscription si tab=register dans l'URL
  const [activeTab, setActiveTab] = useState(tabParam === 'register' ? 'register' : 'login');
  
  const { login, register } = useAuth();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();

  // État Login
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [loginLoading, setLoginLoading] = useState(false);

  // État Register
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    businessName: ''
  });
  const [registerLoading, setRegisterLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);

    try {
      await login(loginData.email, loginData.password);
      success('Connexion réussie ! Bienvenue 👋');
      
      // Vérifier si un rôle a été choisi avant (Flow 1)
      const selectedRole = localStorage.getItem('selectedRole');
      
      if (selectedRole && searchParams.get('from') === 'role-selection') {
        console.log('🎯 Rôle choisi:', selectedRole);
        
        // Si propriétaire ou client → aller au dashboard directement
        if (selectedRole === 'owner' || selectedRole === 'client') {
          localStorage.removeItem('selectedRole'); // Nettoyer
          navigate('/dashboard');
        } else {
          // Team, Player, Subscriber → formulaire complémentaire
          navigate(`/register/${selectedRole}`);
        }
      } else if (redirectUrl) {
        navigate(redirectUrl);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      showError(err.message || 'Erreur de connexion');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterLoading(true);

    try {
      // Déterminer le rôle : soit depuis localStorage (flow multi-rôles), soit 'client' par défaut
      const selectedRole = localStorage.getItem('selectedRole');
      const role = selectedRole === 'owner' ? 'owner' : 'client';
      
      const dataToSend = {
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        email: registerData.email,
        phone: registerData.phone,
        password: registerData.password,
        role: role
      };

      // Si propriétaire et nom d'entreprise fourni
      if (role === 'owner' && registerData.businessName) {
        dataToSend.ownerProfile = {
          businessName: registerData.businessName
        };
      }

      const result = await register(dataToSend);
      success(result.message || 'Inscription réussie! 🎉');
      
      setTimeout(() => {
        // Vérifier si un rôle a été choisi avant (Flow 1)
        const selectedRole = localStorage.getItem('selectedRole');
        
        if (selectedRole && searchParams.get('from') === 'role-selection') {
          console.log('🎯 Rôle choisi:', selectedRole);
          
          // Si propriétaire ou client → aller au dashboard directement
          if (selectedRole === 'owner' || selectedRole === 'client') {
            localStorage.removeItem('selectedRole'); // Nettoyer
            navigate('/dashboard');
          } else {
            // Team, Player, Subscriber → formulaire complémentaire
            navigate(`/register/${selectedRole}`);
          }
        } else if (redirectUrl) {
          navigate(redirectUrl);
        } else {
          navigate('/dashboard');
        }
      }, 2000);
    } catch (err) {
      showError(err.message || 'Erreur lors de l\'inscription');
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center py-12 px-4 overflow-hidden">
      {/* Background Image avec overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2940&auto=format&fit=crop"
          alt="Football background"
          className="w-full h-full object-cover"
        />
        {/* Overlay gradient pour lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-gray-900/90 to-green-900/85"></div>
        
        {/* Effet de particules/grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      {/* Floating shapes decoratifs animés */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-green-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-md relative z-10">
        {/* Card avec effet glassmorphism subtle */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          
          {/* Tabs Header */}
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-4 text-sm font-semibold transition-all ${
                activeTab === 'login'
                  ? 'text-green-600 border-b-2 border-green-600 bg-white'
                  : 'text-gray-500 hover:text-gray-700 bg-gray-50'
              }`}
            >
              Connexion
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-4 text-sm font-semibold transition-all ${
                activeTab === 'register'
                  ? 'text-green-600 border-b-2 border-green-600 bg-white'
                  : 'text-gray-500 hover:text-gray-700 bg-gray-50'
              }`}
            >
              Inscription
            </button>
          </div>

          {/* Content */}
          <div className="p-8">
            
            {/* LOGIN TAB */}
            {activeTab === 'login' && (
              <>
                {/* Header */}
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Bon retour
                  </h1>
                  <p className="text-sm text-gray-600">
                    Connectez-vous à votre compte
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-5">
                  {/* Email */}
                  <div className="space-y-2">
                    <label htmlFor="login-email" className="text-sm font-medium text-gray-900">
                      Email
                    </label>
                    <input
                      id="login-email"
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                      placeholder="m@exemple.com"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all text-sm"
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="login-password" className="text-sm font-medium text-gray-900">
                        Mot de passe
                      </label>
                      <a 
                        href="#" 
                        className="text-xs text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        Mot de passe oublié ?
                      </a>
                    </div>
                    <input
                      id="login-password"
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                      placeholder="••••••••"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all text-sm"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="w-full h-10 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {loginLoading ? 'Connexion...' : 'Se connecter'}
                  </button>
                </form>

                {/* Divider */}
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-4 text-gray-500">Ou continuer avec</span>
                  </div>
                </div>

                {/* Social Login */}
                <div className="space-y-3">
                  {/* Google */}
                  <button
                    type="button"
                    onClick={() => {
                      const selectedRole = localStorage.getItem('selectedRole');
                      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                      window.location.href = `${apiUrl}/auth/google${selectedRole ? `?role=${selectedRole}` : ''}`;
                    }}
                    className="w-full flex items-center justify-center gap-3 h-11 px-4 border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all font-medium text-gray-700"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continuer avec Google
                  </button>
                  
                  {/* Facebook */}
                  <button
                    type="button"
                    onClick={() => {
                      const selectedRole = localStorage.getItem('selectedRole');
                      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                      window.location.href = `${apiUrl}/auth/facebook${selectedRole ? `?role=${selectedRole}` : ''}`;
                    }}
                    className="w-full flex items-center justify-center gap-3 h-11 px-4 bg-[#1877F2] hover:bg-[#166FE5] rounded-xl transition-all font-medium text-white"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Continuer avec Facebook
                  </button>
                </div>
              </>
            )}

            {/* REGISTER TAB */}
            {activeTab === 'register' && (
              <>
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
                <form onSubmit={handleRegister} className="space-y-4">
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
                        value={registerData.firstName}
                        onChange={(e) => setRegisterData({ ...registerData, [e.target.name]: e.target.value })}
                        required
                        placeholder="Ali"
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all text-sm"
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
                        value={registerData.lastName}
                        onChange={(e) => setRegisterData({ ...registerData, [e.target.name]: e.target.value })}
                        required
                        placeholder="Ndiaye"
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all text-sm"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label htmlFor="register-email" className="text-sm font-medium text-gray-900">
                      Email
                    </label>
                    <input
                      id="register-email"
                      type="email"
                      name="email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, [e.target.name]: e.target.value })}
                      required
                      placeholder="m@exemple.com"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all text-sm"
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
                      value={registerData.phone}
                      onChange={(e) => setRegisterData({ ...registerData, [e.target.name]: e.target.value })}
                      required
                      placeholder="77 123 45 67"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all text-sm"
                    />
                  </div>

                  {/* Mot de passe */}
                  <div className="space-y-2">
                    <label htmlFor="register-password" className="text-sm font-medium text-gray-900">
                      Mot de passe
                    </label>
                    <input
                      id="register-password"
                      type="password"
                      name="password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, [e.target.name]: e.target.value })}
                      required
                      minLength={6}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all text-sm"
                    />
                    <p className="text-xs text-gray-500">Minimum 6 caractères</p>
                  </div>

                  {/* Nom entreprise - Uniquement si rôle owner */}
                  {localStorage.getItem('selectedRole') === 'owner' && (
                    <div className="space-y-2">
                      <label htmlFor="businessName" className="text-sm font-medium text-gray-900">
                        Nom de l'entreprise
                      </label>
                      <input
                        id="businessName"
                        type="text"
                        name="businessName"
                        value={registerData.businessName}
                        onChange={(e) => setRegisterData({ ...registerData, [e.target.name]: e.target.value })}
                        required
                        placeholder="Ex: Galaxy Arena"
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all text-sm"
                      />
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={registerLoading}
                    className="w-full h-10 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-6"
                  >
                    {registerLoading ? 'Inscription...' : 'S\'inscrire'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <p className="text-center text-xs text-white/70 mt-6 backdrop-blur-sm bg-white/5 py-3 px-4 rounded-xl border border-white/10">
          En vous connectant, vous acceptez nos{' '}
          <a href="/terms" className="underline hover:text-white transition-colors">
            Conditions d'utilisation
          </a>
          {' '}et notre{' '}
          <a href="/privacy" className="underline hover:text-white transition-colors">
            Politique de confidentialité
          </a>
        </p>
      </div>
    </div>
  );
};

export default Auth;

