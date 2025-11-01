const Team = require('../models/Team');
const User = require('../models/User');
const Terrain = require('../models/Terrain');

// @route   GET /api/teams
// @desc    Get all teams
// @access  Public
exports.getTeams = async (req, res) => {
  try {
    const { captain, search } = req.query;
    let query = { isActive: true };

    if (captain) {
      query.captain = captain;
    }

    if (search) {
      query.name = new RegExp(search, 'i');
    }

    const teams = await Team.find(query)
      .populate('captain', 'firstName lastName avatar')
      .populate('members.user', 'firstName lastName avatar')
      .sort('-createdAt')
      .lean();

    res.json({
      success: true,
      count: teams.length,
      data: teams
    });
  } catch (error) {
    console.error('Erreur getTeams:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des équipes',
      error: error.message
    });
  }
};

// @route   GET /api/teams/:id
// @desc    Get single team
// @access  Public
exports.getTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('captain', 'firstName lastName phone email avatar')
      .populate('members.user', 'firstName lastName avatar')
      .populate('favoriteTerrains')
      .populate('subscription.terrain');

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Équipe non trouvée'
      });
    }

    res.json({
      success: true,
      data: team
    });
  } catch (error) {
    console.error('Erreur getTeam:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'équipe',
      error: error.message
    });
  }
};

// @route   POST /api/teams
// @desc    Create team
// @access  Private
exports.createTeam = async (req, res) => {
  try {
    const { name, logo, description } = req.body;

    // Vérifier si le nom existe déjà
    const existingTeam = await Team.findOne({ name });
    if (existingTeam) {
      return res.status(400).json({
        success: false,
        message: 'Une équipe avec ce nom existe déjà'
      });
    }

    // Créer l'équipe avec l'utilisateur comme capitaine
    const team = await Team.create({
      name,
      logo,
      description,
      captain: req.user.id,
      members: [{
        user: req.user.id,
        position: 'milieu',
        joinedAt: new Date()
      }]
    });

    await team.populate('captain', 'firstName lastName avatar');
    await team.populate('members.user', 'firstName lastName avatar');

    res.status(201).json({
      success: true,
      message: 'Équipe créée avec succès',
      data: team
    });
  } catch (error) {
    console.error('Erreur createTeam:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'équipe',
      error: error.message
    });
  }
};

// @route   PUT /api/teams/:id
// @desc    Update team
// @access  Private (Captain only)
exports.updateTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Équipe non trouvée'
      });
    }

    // Vérifier que l'utilisateur est le capitaine
    if (!team.isCaptain(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Seul le capitaine peut modifier l\'équipe'
      });
    }

    // Champs modifiables
    const allowedUpdates = ['name', 'logo', 'description'];
    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const updatedTeam = await Team.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('captain members.user');

    res.json({
      success: true,
      message: 'Équipe mise à jour avec succès',
      data: updatedTeam
    });
  } catch (error) {
    console.error('Erreur updateTeam:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'équipe',
      error: error.message
    });
  }
};

// @route   DELETE /api/teams/:id
// @desc    Delete team
// @access  Private (Captain only)
exports.deleteTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Équipe non trouvée'
      });
    }

    // Vérifier que l'utilisateur est le capitaine
    if (!team.isCaptain(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Seul le capitaine peut supprimer l\'équipe'
      });
    }

    await team.deleteOne();

    res.json({
      success: true,
      message: 'Équipe supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur deleteTeam:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'équipe',
      error: error.message
    });
  }
};

// @route   POST /api/teams/:id/members
// @desc    Add member to team
// @access  Private (Captain only)
exports.addMember = async (req, res) => {
  try {
    const { userId, position } = req.body;
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Équipe non trouvée'
      });
    }

    // Vérifier que l'utilisateur est le capitaine
    if (!team.isCaptain(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Seul le capitaine peut ajouter des membres'
      });
    }

    // Vérifier que l'utilisateur existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Ajouter le membre
    try {
      await team.addMember(userId, position || 'milieu');
      await team.populate('members.user', 'firstName lastName avatar');

      res.json({
        success: true,
        message: 'Membre ajouté avec succès',
        data: team
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

  } catch (error) {
    console.error('Erreur addMember:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'ajout du membre',
      error: error.message
    });
  }
};

// @route   DELETE /api/teams/:id/members/:userId
// @desc    Remove member from team
// @access  Private (Captain only)
exports.removeMember = async (req, res) => {
  try {
    const { userId } = req.params;
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Équipe non trouvée'
      });
    }

    // Vérifier que l'utilisateur est le capitaine
    if (!team.isCaptain(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Seul le capitaine peut retirer des membres'
      });
    }

    // Retirer le membre
    try {
      await team.removeMember(userId);

      res.json({
        success: true,
        message: 'Membre retiré avec succès',
        data: team
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

  } catch (error) {
    console.error('Erreur removeMember:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du retrait du membre',
      error: error.message
    });
  }
};

// @route   POST /api/teams/:id/subscribe
// @desc    Subscribe team to a terrain
// @access  Private (Captain only)
exports.subscribe = async (req, res) => {
  try {
    const { terrainId, plan } = req.body;
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Équipe non trouvée'
      });
    }

    // Vérifier que l'utilisateur est le capitaine
    if (!team.isCaptain(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Seul le capitaine peut souscrire à un abonnement'
      });
    }

    // Vérifier que le terrain existe
    const terrain = await Terrain.findById(terrainId);
    if (!terrain) {
      return res.status(404).json({
        success: false,
        message: 'Terrain non trouvé'
      });
    }

    // Calculer les dates et le prix selon le plan
    const startDate = new Date();
    let endDate = new Date();
    let discount = 0;
    let price = 0;

    switch (plan) {
      case 'weekly':
        endDate.setDate(endDate.getDate() + 7);
        discount = 5; // 5% de réduction
        price = terrain.pricePerHour * 7 * 0.95; // Prix approximatif
        break;
      case 'monthly':
        endDate.setMonth(endDate.getMonth() + 1);
        discount = 10; // 10% de réduction
        price = terrain.pricePerHour * 30 * 0.9;
        break;
      case 'yearly':
        endDate.setFullYear(endDate.getFullYear() + 1);
        discount = 20; // 20% de réduction
        price = terrain.pricePerHour * 365 * 0.8;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Plan invalide (weekly, monthly, yearly)'
        });
    }

    team.subscription = {
      terrain: terrainId,
      plan,
      startDate,
      endDate,
      isActive: true,
      discount,
      price
    };

    await team.save();
    await team.populate('subscription.terrain');

    res.json({
      success: true,
      message: 'Abonnement souscrit avec succès',
      data: team
    });

  } catch (error) {
    console.error('Erreur subscribe:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la souscription',
      error: error.message
    });
  }
};

