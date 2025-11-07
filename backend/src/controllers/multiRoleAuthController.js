const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Team = require('../models/Team');
const Player = require('../models/Player');
const Subscriber = require('../models/Subscriber');
const User = require('../models/User');

// @desc    Inscription en tant qu'ÉQUIPE
// @route   POST /api/auth/register/team
// @access  Public
exports.registerTeam = async (req, res) => {
  try {
    const {
      name,
      logo,
      description,
      captain,
      category,
      matchType,
      homeTerrain,
      city,
      region,
      address,
      postalCode,
      latitude,
      longitude,
      foundedYear
    } = req.body;

    // Vérifier si l'email existe déjà dans Team
    const existingTeam = await Team.findOne({ 'captain.email': captain.email });
    if (existingTeam) {
      return res.status(400).json({
        success: false,
        message: 'Une équipe avec cet email existe déjà'
      });
    }

    // Hasher le mot de passe (sauf si c'est un user existant du Flow 1)
    let hashedPassword;
    if (captain.password === 'existing-user') {
      // L'utilisateur existe déjà (Flow 1), utiliser un mot de passe fictif
      // Dans ce cas, le capitaine ne se connectera pas avec ce compte Team,
      // mais avec son compte User existant
      hashedPassword = await bcrypt.hash('temp-' + Date.now(), 10);
    } else {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(captain.password, salt);
    }

    // Créer l'équipe
    const newTeam = await Team.create({
      name,
      logo,
      description,
      captain: {
        ...captain,
        password: hashedPassword
      },
      category,
      matchType,
      homeTerrain,
      city,
      region,
      address,
      postalCode,
      latitude: latitude ? parseFloat(latitude) : undefined,
      longitude: longitude ? parseFloat(longitude) : undefined,
      foundedYear
    });

    // 🆕 CRÉER ou METTRE À JOUR le compte User associé (SYSTÈME MULTI-RÔLES)
    let user = await User.findOne({ email: captain.email });
    
    if (user) {
      // L'utilisateur existe déjà (Flow 1) → Ajouter les rôles team
      user.addRole('team');
      user.addRole('team-captain');
      user.primaryRole = 'team'; // Définir comme rôle principal
      user.role = 'team'; // Pour compatibilité
      user.teamProfile = {
        teamId: newTeam._id,
        teamName: newTeam.name
      };
      await user.save({ validateBeforeSave: false });
      console.log(`✅ Compte User existant: rôles 'team' + 'team-captain' ajoutés à ${user.email}`);
      console.log(`   Rôles actuels: ${user.roles.join(', ')}`);
    } else {
      // Créer un nouveau compte User (Flow 2)
      user = await User.create({
        firstName: captain.firstName,
        lastName: captain.lastName,
        email: captain.email,
        phone: captain.phone,
        password: captain.password, // Sera hashé par le pre-save hook
        roles: ['team', 'team-captain'], // Rôles multiples
        primaryRole: 'team',
        role: 'team', // Pour compatibilité
        isActive: true,
        teamProfile: {
          teamId: newTeam._id,
          teamName: newTeam.name
        }
      });
      console.log(`✅ Nouveau compte User créé avec roles=['team', 'team-captain']: ${user.email}`);
    }

    // Générer le token JWT (utiliser l'ID du User, pas du Team)
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email,
        role: 'team' 
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      success: true,
      message: 'Équipe créée avec succès',
      data: {
        team: newTeam,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName
        },
        token
      }
    });

  } catch (error) {
    console.error('Erreur registerTeam:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'équipe',
      error: error.message
    });
  }
};

// @desc    Inscription en tant que JOUEUR
// @route   POST /api/auth/register/player
// @access  Public
exports.registerPlayer = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      avatar,
      position,
      preferredFoot,
      dateOfBirth,
      height,
      weight,
      city,
      region,
      level,
      yearsOfExperience,
      lookingForTeam,
      bio
    } = req.body;

    // Vérifier si l'email existe déjà
    const existingPlayer = await Player.findOne({ email });
    if (existingPlayer) {
      return res.status(400).json({
        success: false,
        message: 'Un compte avec cet email existe déjà'
      });
    }

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Créer le joueur
    const newPlayer = await Player.create({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      avatar,
      position,
      preferredFoot,
      dateOfBirth,
      height,
      weight,
      city,
      region,
      level,
      yearsOfExperience,
      lookingForTeam,
      bio
    });

    // Générer le token JWT
    const token = jwt.sign(
      { 
        id: newPlayer._id, 
        email: newPlayer.email,
        role: 'player' 
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      success: true,
      message: 'Joueur inscrit avec succès',
      data: {
        player: newPlayer,
        token
      }
    });

  } catch (error) {
    console.error('Erreur registerPlayer:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'inscription du joueur',
      error: error.message
    });
  }
};

// @desc    Inscription en tant qu'ABONNÉ
// @route   POST /api/auth/register/subscriber
// @access  Public
exports.registerSubscriber = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      avatar,
      city,
      region,
      address,
      interests
    } = req.body;

    // Vérifier si l'email existe déjà
    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
      return res.status(400).json({
        success: false,
        message: 'Un compte avec cet email existe déjà'
      });
    }

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Créer l'abonné
    const newSubscriber = await Subscriber.create({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      avatar,
      city,
      region,
      address,
      interests
    });

    // Générer le token JWT
    const token = jwt.sign(
      { 
        id: newSubscriber._id, 
        email: newSubscriber.email,
        role: 'subscriber' 
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      success: true,
      message: 'Abonné inscrit avec succès',
      data: {
        subscriber: newSubscriber,
        token
      }
    });

  } catch (error) {
    console.error('Erreur registerSubscriber:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'inscription de l\'abonné',
      error: error.message
    });
  }
};

// @desc    Connexion multi-rôles (Team, Player, Subscriber)
// @route   POST /api/auth/login/multi
// @access  Public
exports.loginMultiRole = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe requis'
      });
    }

    // Chercher dans les 3 collections
    let user = null;
    let role = null;
    let passwordField = null;

    // Chercher dans Team
    const team = await Team.findOne({ 'captain.email': email });
    if (team) {
      user = team;
      role = 'team';
      passwordField = team.captain.password;
    }

    // Chercher dans Player
    if (!user) {
      const player = await Player.findOne({ email });
      if (player) {
        user = player;
        role = 'player';
        passwordField = player.password;
      }
    }

    // Chercher dans Subscriber
    if (!user) {
      const subscriber = await Subscriber.findOne({ email });
      if (subscriber) {
        user = subscriber;
        role = 'subscriber';
        passwordField = subscriber.password;
      }
    }

    // Si aucun utilisateur trouvé
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, passwordField);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Générer le token JWT
    const token = jwt.sign(
      { 
        id: user._id, 
        email: role === 'team' ? user.captain.email : user.email,
        role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      message: 'Connexion réussie',
      data: {
        user,
        role,
        token
      }
    });

  } catch (error) {
    console.error('Erreur loginMultiRole:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion',
      error: error.message
    });
  }
};

