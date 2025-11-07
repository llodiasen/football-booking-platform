const Player = require('../models/Player');

// @route   GET /api/players
// @desc    Get all players with filters
// @access  Public
exports.getAllPlayers = async (req, res) => {
  try {
    const { 
      position, 
      level, 
      city, 
      lookingForTeam,
      search,
      page = 1,
      limit = 50
    } = req.query;

    // Construire la query
    const query = {};

    if (position && position !== 'all') {
      query.position = position;
    }

    if (level && level !== 'all') {
      query.level = level;
    }

    if (city && city !== 'all') {
      query.city = city;
    }

    if (lookingForTeam === 'true') {
      query.lookingForTeam = true;
    }

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const skip = (page - 1) * limit;

    const players = await Player.find(query)
      .select('-password')
      .populate('currentTeam', 'name logo')
      .sort('-createdAt')
      .limit(parseInt(limit))
      .skip(skip)
      .lean();

    const total = await Player.countDocuments(query);

    res.json({
      success: true,
      data: players,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: players.length,
        totalPlayers: total
      }
    });

  } catch (error) {
    console.error('Erreur getAllPlayers:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des joueurs',
      error: error.message
    });
  }
};

// @route   GET /api/players/:id
// @desc    Get single player
// @access  Public
exports.getPlayer = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id)
      .select('-password')
      .populate('currentTeam', 'name logo city')
      .populate('teamsHistory.teamId', 'name logo')
      .lean();

    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Joueur non trouvé'
      });
    }

    res.json({
      success: true,
      data: player
    });

  } catch (error) {
    console.error('Erreur getPlayer:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du joueur',
      error: error.message
    });
  }
};

module.exports = {
  getAllPlayers,
  getPlayer
};

