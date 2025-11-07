const express = require('express');
const router = express.Router();

// @route   GET /api/auth/google
// @desc    Initier l'authentification Google OAuth
// @access  Public
router.get('/google', (req, res) => {
  // TODO: Implémenter avec Passport.js + Google OAuth
  // Pour l'instant, renvoyer un message informatif
  res.status(501).json({
    success: false,
    message: 'Connexion Google en cours de configuration',
    info: 'Pour activer cette fonctionnalité, configurez Google OAuth dans les variables d\'environnement',
    nextSteps: [
      '1. Créer une app sur Google Cloud Console',
      '2. Obtenir Client ID et Client Secret',
      '3. Ajouter GOOGLE_CLIENT_ID et GOOGLE_CLIENT_SECRET dans .env',
      '4. Configurer Passport.js avec la stratégie Google'
    ]
  });
});

// @route   GET /api/auth/google/callback
// @desc    Callback Google OAuth
// @access  Public
router.get('/google/callback', (req, res) => {
  // TODO: Gérer le callback Google OAuth
  res.status(501).json({
    success: false,
    message: 'Google OAuth callback en attente de configuration'
  });
});

// @route   GET /api/auth/facebook
// @desc    Initier l'authentification Facebook OAuth
// @access  Public
router.get('/facebook', (req, res) => {
  // TODO: Implémenter avec Passport.js + Facebook OAuth
  res.status(501).json({
    success: false,
    message: 'Connexion Facebook en cours de configuration',
    info: 'Pour activer cette fonctionnalité, configurez Facebook OAuth dans les variables d\'environnement',
    nextSteps: [
      '1. Créer une app sur Facebook Developers',
      '2. Obtenir App ID et App Secret',
      '3. Ajouter FACEBOOK_APP_ID et FACEBOOK_APP_SECRET dans .env',
      '4. Configurer Passport.js avec la stratégie Facebook'
    ]
  });
});

// @route   GET /api/auth/facebook/callback
// @desc    Callback Facebook OAuth
// @access  Public
router.get('/facebook/callback', (req, res) => {
  // TODO: Gérer le callback Facebook OAuth
  res.status(501).json({
    success: false,
    message: 'Facebook OAuth callback en attente de configuration'
  });
});

module.exports = router;

