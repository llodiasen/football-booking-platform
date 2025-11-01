const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Générer JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, role, ownerProfile } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email ou numéro de téléphone déjà utilisé'
      });
    }

    // Préparer les données utilisateur
    const userData = {
      email,
      password,
      firstName,
      lastName,
      phone,
      role: role || 'client'
    };

    // Si c'est un propriétaire, ajouter les infos business
    if (role === 'owner' && ownerProfile) {
      userData.ownerProfile = {
        businessName: ownerProfile.businessName,
        businessLicense: ownerProfile.businessLicense,
        approved: false // Nécessite approbation admin
      };
    }

    // Créer l'utilisateur
    const user = await User.create(userData);

    // Générer le token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: role === 'owner' 
        ? 'Compte créé avec succès. En attente d\'approbation par un administrateur.' 
        : 'Compte créé avec succès',
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          role: user.role,
          ownerProfile: user.ownerProfile
        },
        token
      }
    });
  } catch (error) {
    console.error('Erreur register:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'inscription',
      error: error.message
    });
  }
};

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Vérifier si le compte est actif
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Votre compte a été désactivé. Contactez l\'administration.'
      });
    }

    // Vérifier le mot de passe
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Générer le token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Connexion réussie',
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          role: user.role,
          avatar: user.avatar,
          ownerProfile: user.ownerProfile
        },
        token
      }
    });
  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion',
      error: error.message
    });
  }
};

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Erreur getMe:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du profil',
      error: error.message
    });
  }
};

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const allowedUpdates = ['firstName', 'lastName', 'phone', 'avatar'];
    const updates = {};

    // Filtrer uniquement les champs autorisés
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    // Si propriétaire, permettre la mise à jour du businessName
    if (req.user.role === 'owner' && req.body.ownerProfile?.businessName) {
      updates['ownerProfile.businessName'] = req.body.ownerProfile.businessName;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Profil mis à jour avec succès',
      data: user
    });
  } catch (error) {
    console.error('Erreur updateProfile:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du profil',
      error: error.message
    });
  }
};

// @route   PUT /api/auth/change-password
// @desc    Change password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Récupérer l'utilisateur avec le mot de passe
    const user = await User.findById(req.user.id);
    
    // Vérifier le mot de passe actuel
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Mot de passe actuel incorrect'
      });
    }

    // Mettre à jour le mot de passe (sera hashé par le pre-save hook)
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Mot de passe modifié avec succès'
    });
  } catch (error) {
    console.error('Erreur changePassword:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du changement de mot de passe',
      error: error.message
    });
  }
};

