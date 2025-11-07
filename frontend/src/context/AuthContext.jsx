import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Charger l'utilisateur au montage du composant
  useEffect(() => {
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  // Charger les informations de l'utilisateur
  const loadUser = async () => {
    try {
      console.log('🔍 loadUser: Tentative de chargement du profil...');
      console.log('🔑 Token présent:', !!token);
      const response = await authAPI.getMe();
      console.log('✅ loadUser: Profil chargé avec succès:', response.data.data);
      setUser(response.data.data);
    } catch (error) {
      console.error('❌ Error loading user:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      console.log('🚪 Déconnexion forcée...');
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Connexion
  const login = async (email, password) => {
    try {
      console.log('🔐 login: Tentative de connexion avec:', email);
      const response = await authAPI.login({ email, password });
      const { user, token } = response.data.data;
      
      console.log('✅ login: Connexion réussie !');
      console.log('👤 User:', user);
      console.log('🔑 Token:', token?.substring(0, 30) + '...');
      console.log('🎭 Role:', user.role);
      console.log('🎭 Roles:', user.roles);
      console.log('🎯 Primary:', user.primaryRole);
      
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      
      console.log('💾 Token sauvegardé dans localStorage');
      
      return { success: true, user };
    } catch (error) {
      console.error('❌ login error:', error);
      const message = error.response?.data?.message || 'Erreur de connexion';
      throw new Error(message);
    }
  };

  // Inscription
  const register = async (data) => {
    try {
      const response = await authAPI.register(data);
      const { user, token } = response.data.data;
      
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      
      return { success: true, user, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors de l\'inscription';
      throw new Error(message);
    }
  };

  // Déconnexion
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // Mettre à jour le profil
  const updateProfile = async (data) => {
    try {
      const response = await authAPI.updateProfile(data);
      setUser(response.data.data);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors de la mise à jour';
      throw new Error(message);
    }
  };

  // Changer le mot de passe
  const changePassword = async (currentPassword, newPassword) => {
    try {
      await authAPI.changePassword({ currentPassword, newPassword });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors du changement de mot de passe';
      throw new Error(message);
    }
  };

  // Connexion avec token existant (après inscription multi-rôles)
  const loginWithToken = (token, userData) => {
    console.log('🔐 loginWithToken appelé avec:', { token: token?.substring(0, 20) + '...', userData });
    localStorage.setItem('token', token);
    console.log('✅ Token sauvegardé dans localStorage');
    setToken(token);
    console.log('✅ setToken appelé');
    setUser(userData);
    console.log('✅ setUser appelé avec:', userData);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    loginWithToken,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isOwner: user?.role === 'owner',
    isClient: user?.role === 'client',
    isTeam: user?.role === 'team',
    isPlayer: user?.role === 'player',
    isSubscriber: user?.role === 'subscriber'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personnalisé pour utiliser le contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;

