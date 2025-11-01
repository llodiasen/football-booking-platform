const { body, validationResult } = require('express-validator');

// Middleware pour gérer les erreurs de validation
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Erreurs de validation',
      errors: errors.array()
    });
  }
  next();
};

// Validation pour l'inscription
exports.validateRegister = [
  body('email')
    .trim()
    .isEmail().withMessage('Email invalide')
    .normalizeEmail(),
  body('password')
    .trim()
    .isLength({ min: 6 }).withMessage('Mot de passe minimum 6 caractères'),
  body('firstName')
    .trim()
    .notEmpty().withMessage('Prénom requis')
    .isLength({ min: 2 }).withMessage('Prénom minimum 2 caractères'),
  body('lastName')
    .trim()
    .notEmpty().withMessage('Nom requis')
    .isLength({ min: 2 }).withMessage('Nom minimum 2 caractères'),
  body('phone')
    .trim()
    .notEmpty().withMessage('Téléphone requis')
    .matches(/^(\+221)?[0-9]{9}$/).withMessage('Numéro de téléphone invalide (format: +221XXXXXXXXX ou XXXXXXXXX)'),
  body('role')
    .optional()
    .isIn(['client', 'owner', 'team']).withMessage('Rôle invalide'),
  body('ownerProfile.businessName')
    .if(body('role').equals('owner'))
    .notEmpty().withMessage('Nom de l\'entreprise requis pour les propriétaires'),
];

// Validation pour la connexion
exports.validateLogin = [
  body('email')
    .trim()
    .isEmail().withMessage('Email invalide')
    .normalizeEmail(),
  body('password')
    .trim()
    .notEmpty().withMessage('Mot de passe requis'),
];

// Validation pour le changement de mot de passe
exports.validateChangePassword = [
  body('currentPassword')
    .trim()
    .notEmpty().withMessage('Mot de passe actuel requis'),
  body('newPassword')
    .trim()
    .isLength({ min: 6 }).withMessage('Nouveau mot de passe minimum 6 caractères')
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error('Le nouveau mot de passe doit être différent de l\'ancien');
      }
      return true;
    }),
];

// Validation pour la création d'un terrain
exports.validateTerrain = [
  body('name')
    .trim()
    .notEmpty().withMessage('Nom du terrain requis')
    .isLength({ min: 3 }).withMessage('Nom minimum 3 caractères'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description requise')
    .isLength({ min: 20 }).withMessage('Description minimum 20 caractères'),
  body('address.city')
    .trim()
    .notEmpty().withMessage('Ville requise'),
  body('address.region')
    .trim()
    .notEmpty().withMessage('Région requise'),
  body('type')
    .isIn(['synthetique', 'naturel', 'stabilise']).withMessage('Type de terrain invalide'),
  body('size')
    .isIn(['5x5', '7x7', '11x11']).withMessage('Taille de terrain invalide'),
  body('pricePerHour')
    .isFloat({ min: 0 }).withMessage('Prix doit être un nombre positif'),
];

// Validation pour une réservation
exports.validateReservation = [
  body('terrain')
    .notEmpty().withMessage('Terrain requis')
    .isMongoId().withMessage('ID terrain invalide'),
  body('date')
    .notEmpty().withMessage('Date requise')
    .isISO8601().withMessage('Format de date invalide')
    .custom((value) => {
      const date = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date < today) {
        throw new Error('La date doit être dans le futur');
      }
      return true;
    }),
  body('startTime')
    .notEmpty().withMessage('Heure de début requise')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Format d\'heure invalide (HH:MM)'),
  body('endTime')
    .notEmpty().withMessage('Heure de fin requise')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Format d\'heure invalide (HH:MM)')
    .custom((value, { req }) => {
      const start = req.body.startTime.split(':').map(Number);
      const end = value.split(':').map(Number);
      const startMinutes = start[0] * 60 + start[1];
      const endMinutes = end[0] * 60 + end[1];
      if (endMinutes <= startMinutes) {
        throw new Error('L\'heure de fin doit être après l\'heure de début');
      }
      return true;
    }),
  body('paymentMethod')
    .isIn(['wave', 'orange_money', 'free_money', 'cash']).withMessage('Méthode de paiement invalide'),
];

// Validation pour un paiement
exports.validatePayment = [
  body('reservationId')
    .notEmpty().withMessage('ID de réservation requis')
    .isMongoId().withMessage('ID de réservation invalide'),
  body('phoneNumber')
    .trim()
    .notEmpty().withMessage('Numéro de téléphone requis')
    .matches(/^(\+221)?[0-9]{9}$/).withMessage('Numéro de téléphone invalide'),
  body('paymentMethod')
    .isIn(['wave', 'orange_money', 'free_money']).withMessage('Méthode de paiement invalide'),
];

// Validation pour une équipe
exports.validateTeam = [
  body('name')
    .trim()
    .notEmpty().withMessage('Nom de l\'équipe requis')
    .isLength({ min: 3 }).withMessage('Nom minimum 3 caractères'),
];

