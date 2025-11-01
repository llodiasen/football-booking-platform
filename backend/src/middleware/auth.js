const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware pour protéger les routes
exports.protect = async (req, res, next) => {
  try {
    let token;
    
    // Vérifier si le token existe dans le header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Non autorisé - Token manquant'
      });
    }

    try {
      // Vérifier le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Charger l'utilisateur sans le mot de passe
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      // Vérifier si l'utilisateur est actif
      if (!req.user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Compte désactivé'
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Non autorisé - Token invalide ou expiré'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'authentification',
      error: error.message
    });
  }
};

// Middleware pour autoriser certains rôles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Non authentifié'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Accès refusé - Rôle ${req.user.role} non autorisé pour cette action`
      });
    }
    
    next();
  };
};

// Middleware pour vérifier si le propriétaire est approuvé
exports.checkOwnerApproval = (req, res, next) => {
  if (req.user.role === 'owner' && !req.user.ownerProfile?.approved) {
    return res.status(403).json({
      success: false,
      message: 'Votre compte propriétaire est en attente d\'approbation par un administrateur'
    });
  }
  next();
};

