const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Team = require('../models/Team');
const Player = require('../models/Player');
const Subscriber = require('../models/Subscriber');

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
      
      console.log('🔐 Token décodé:', { id: decoded.id, role: decoded.role });
      
      // Charger l'utilisateur selon le rôle (support multi-rôles)
      let user = null;
      
      if (decoded.role === 'team') {
        user = await Team.findById(decoded.id);
      } else if (decoded.role === 'player') {
        user = await Player.findById(decoded.id);
      } else if (decoded.role === 'subscriber') {
        user = await Subscriber.findById(decoded.id);
      } else {
        // Rôles classiques (client, owner, admin)
        user = await User.findById(decoded.id).select('-password');
      }
      
      if (!user) {
        console.log('❌ Utilisateur non trouvé pour:', decoded);
        return res.status(401).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      console.log('✅ Utilisateur authentifié:', user.role || decoded.role);
      
      // Ajouter les infos du token décodé à req.user
      req.user = { 
        ...user.toObject(), 
        id: decoded.id,
        role: decoded.role || user.role 
      };

      // Vérifier si l'utilisateur est actif (si le champ existe)
      if (user.isActive !== undefined && !user.isActive) {
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

