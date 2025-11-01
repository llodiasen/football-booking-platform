const Terrain = require('../models/Terrain');
const Reservation = require('../models/Reservation');

// @route   GET /api/terrains
// @desc    Get all terrains with filters
// @access  Public
exports.getTerrains = async (req, res) => {
  try {
    const {
      city,
      region,
      minPrice,
      maxPrice,
      size,
      type,
      amenities,
      search,
      latitude,
      longitude,
      radius = 10000, // 10km par défaut
      sort = '-createdAt',
      page = 1,
      limit = 12
    } = req.query;

    let query = { isActive: true, isApproved: true };

    // Filtres de base
    if (city) query['address.city'] = new RegExp(city, 'i');
    if (region) query['address.region'] = new RegExp(region, 'i');
    
    // Filtre de prix
    if (minPrice || maxPrice) {
      query.pricePerHour = {};
      if (minPrice) query.pricePerHour.$gte = Number(minPrice);
      if (maxPrice) query.pricePerHour.$lte = Number(maxPrice);
    }
    
    // Autres filtres
    if (size) query.size = size;
    if (type) query.type = type;
    
    // Filtre équipements (doit avoir tous les équipements demandés)
    if (amenities) {
      const amenitiesArray = amenities.split(',');
      query.amenities = { $all: amenitiesArray };
    }
    
    // Recherche textuelle
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }

    // Recherche géographique
    if (latitude && longitude) {
      query['address.coordinates'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [Number(longitude), Number(latitude)]
          },
          $maxDistance: Number(radius)
        }
      };
    }

    // Gestion du tri
    let sortOption;
    switch (sort) {
      case 'price_asc':
        sortOption = { pricePerHour: 1 };
        break;
      case 'price_desc':
        sortOption = { pricePerHour: -1 };
        break;
      case 'rating':
        sortOption = { 'rating.average': -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Exécuter la requête
    const terrains = await Terrain.find(query)
      .populate('owner', 'firstName lastName phone email')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Compter le total pour la pagination
    const total = await Terrain.countDocuments(query);

    res.json({
      success: true,
      count: terrains.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      data: terrains
    });
  } catch (error) {
    console.error('Erreur getTerrains:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des terrains',
      error: error.message
    });
  }
};

// @route   GET /api/terrains/:id
// @desc    Get single terrain
// @access  Public
exports.getTerrain = async (req, res) => {
  try {
    const terrain = await Terrain.findById(req.params.id)
      .populate('owner', 'firstName lastName phone email ownerProfile')
      .populate('reviews.user', 'firstName lastName avatar');

    if (!terrain) {
      return res.status(404).json({
        success: false,
        message: 'Terrain non trouvé'
      });
    }

    // Incrémenter le nombre de vues
    terrain.views += 1;
    await terrain.save();

    res.json({
      success: true,
      data: terrain
    });
  } catch (error) {
    console.error('Erreur getTerrain:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du terrain',
      error: error.message
    });
  }
};

// @route   POST /api/terrains
// @desc    Create terrain
// @access  Private (Owner, Admin)
exports.createTerrain = async (req, res) => {
  try {
    // Ajouter l'owner depuis le user authentifié
    req.body.owner = req.user.id;
    
    // Si c'est un owner, vérifier qu'il est approuvé
    if (req.user.role === 'owner' && !req.user.ownerProfile?.approved) {
      return res.status(403).json({
        success: false,
        message: 'Votre compte propriétaire doit être approuvé par un administrateur avant de pouvoir créer un terrain'
      });
    }
    
    // Admin approuve automatiquement, owner nécessite approbation
    req.body.isApproved = req.user.role === 'admin';
    
    const terrain = await Terrain.create(req.body);

    res.status(201).json({
      success: true,
      message: req.user.role === 'admin' 
        ? 'Terrain créé et approuvé avec succès'
        : 'Terrain créé avec succès. En attente d\'approbation par un administrateur.',
      data: terrain
    });
  } catch (error) {
    console.error('Erreur createTerrain:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du terrain',
      error: error.message
    });
  }
};

// @route   PUT /api/terrains/:id
// @desc    Update terrain
// @access  Private (Owner, Admin)
exports.updateTerrain = async (req, res) => {
  try {
    let terrain = await Terrain.findById(req.params.id);

    if (!terrain) {
      return res.status(404).json({
        success: false,
        message: 'Terrain non trouvé'
      });
    }

    // Vérifier que l'utilisateur est le propriétaire ou un admin
    if (terrain.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à modifier ce terrain'
      });
    }

    // Ne pas permettre de changer le propriétaire
    delete req.body.owner;
    
    // Ne pas permettre au owner de s'auto-approuver
    if (req.user.role !== 'admin') {
      delete req.body.isApproved;
    }

    terrain = await Terrain.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Terrain mis à jour avec succès',
      data: terrain
    });
  } catch (error) {
    console.error('Erreur updateTerrain:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du terrain',
      error: error.message
    });
  }
};

// @route   DELETE /api/terrains/:id
// @desc    Delete terrain
// @access  Private (Owner, Admin)
exports.deleteTerrain = async (req, res) => {
  try {
    const terrain = await Terrain.findById(req.params.id);

    if (!terrain) {
      return res.status(404).json({
        success: false,
        message: 'Terrain non trouvé'
      });
    }

    // Vérifier que l'utilisateur est le propriétaire ou un admin
    if (terrain.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à supprimer ce terrain'
      });
    }

    // Vérifier s'il y a des réservations futures
    const futureReservations = await Reservation.countDocuments({
      terrain: req.params.id,
      date: { $gte: new Date() },
      status: { $in: ['pending', 'confirmed'] }
    });

    if (futureReservations > 0) {
      return res.status(400).json({
        success: false,
        message: `Impossible de supprimer ce terrain. Il y a ${futureReservations} réservation(s) future(s).`
      });
    }

    await terrain.deleteOne();

    res.json({
      success: true,
      message: 'Terrain supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur deleteTerrain:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du terrain',
      error: error.message
    });
  }
};

// @route   GET /api/terrains/:id/availability
// @desc    Get terrain availability for a date
// @access  Public
exports.getAvailability = async (req, res) => {
  try {
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date requise (format: YYYY-MM-DD)'
      });
    }

    // Vérifier que le terrain existe
    const terrain = await Terrain.findById(req.params.id);
    if (!terrain) {
      return res.status(404).json({
        success: false,
        message: 'Terrain non trouvé'
      });
    }

    // Récupérer les réservations pour cette date
    const reservations = await Reservation.find({
      terrain: req.params.id,
      date: new Date(date),
      status: { $in: ['pending', 'confirmed'] }
    }).select('startTime endTime status').lean();

    res.json({
      success: true,
      data: {
        date,
        terrain: {
          id: terrain._id,
          name: terrain.name,
          openingHours: terrain.openingHours
        },
        reservations
      }
    });
  } catch (error) {
    console.error('Erreur getAvailability:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des disponibilités',
      error: error.message
    });
  }
};

// @route   POST /api/terrains/:id/reviews
// @desc    Add review to terrain
// @access  Private
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Note doit être entre 1 et 5'
      });
    }

    const terrain = await Terrain.findById(req.params.id);

    if (!terrain) {
      return res.status(404).json({
        success: false,
        message: 'Terrain non trouvé'
      });
    }

    // Vérifier si l'utilisateur a déjà laissé un avis
    const alreadyReviewed = terrain.reviews.find(
      r => r.user.toString() === req.user.id
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'Vous avez déjà laissé un avis pour ce terrain'
      });
    }

    // Vérifier si l'utilisateur a déjà réservé ce terrain
    const hasReserved = await Reservation.findOne({
      terrain: req.params.id,
      client: req.user.id,
      status: 'completed'
    });

    if (!hasReserved) {
      return res.status(403).json({
        success: false,
        message: 'Vous devez avoir réservé ce terrain pour laisser un avis'
      });
    }

    // Ajouter le review
    const review = {
      user: req.user.id,
      rating: Number(rating),
      comment: comment || ''
    };

    terrain.reviews.push(review);

    // Mettre à jour la note moyenne
    terrain.rating.count = terrain.reviews.length;
    terrain.rating.average = 
      terrain.reviews.reduce((acc, item) => item.rating + acc, 0) / terrain.reviews.length;

    await terrain.save();

    // Populer le user du nouveau review
    await terrain.populate('reviews.user', 'firstName lastName avatar');

    res.status(201).json({
      success: true,
      message: 'Avis ajouté avec succès',
      data: terrain.reviews[terrain.reviews.length - 1]
    });
  } catch (error) {
    console.error('Erreur addReview:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'ajout de l\'avis',
      error: error.message
    });
  }
};

