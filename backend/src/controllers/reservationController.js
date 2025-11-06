const Reservation = require('../models/Reservation');
const Terrain = require('../models/Terrain');
const Team = require('../models/Team');
const notificationService = require('../services/notificationService');

// Helper pour calculer la durée en heures
const calculateDuration = (startTime, endTime) => {
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  
  return (endMinutes - startMinutes) / 60;
};

// @route   GET /api/reservations
// @desc    Get reservations based on user role
// @access  Private
exports.getReservations = async (req, res) => {
  try {
    let query = {};

    // Filtrer selon le rôle
    if (req.user.role === 'client' || req.user.role === 'team') {
      query.client = req.user.id;
    } else if (req.user.role === 'owner') {
      // Récupérer les terrains du propriétaire
      const terrains = await Terrain.find({ owner: req.user.id }).select('_id');
      const terrainIds = terrains.map(t => t._id);
      query.terrain = { $in: terrainIds };
    }
    // Admin voit tout (pas de filtre)

    const reservations = await Reservation.find(query)
      .populate('terrain', 'name address images pricePerHour')
      .populate('client', 'firstName lastName phone email')
      .populate('team', 'name logo')
      .sort('-createdAt') // Trier par date de création (nouvelles commandes en premier)
      .lean();

    res.json({
      success: true,
      count: reservations.length,
      data: reservations
    });
  } catch (error) {
    console.error('Erreur getReservations:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des réservations',
      error: error.message
    });
  }
};

// @route   GET /api/reservations/:id
// @desc    Get single reservation
// @access  Private
exports.getReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('terrain')
      .populate('client', 'firstName lastName phone email')
      .populate('team', 'name logo members')
      .populate('paymentId');

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    // Vérifier l'autorisation
    const terrain = await Terrain.findById(reservation.terrain._id);
    const isOwner = terrain.owner.toString() === req.user.id;
    const isClient = reservation.client._id.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isClient && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à voir cette réservation'
      });
    }

    res.json({
      success: true,
      data: reservation
    });
  } catch (error) {
    console.error('Erreur getReservation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la réservation',
      error: error.message
    });
  }
};

// @route   POST /api/reservations
// @desc    Create reservation
// @access  Private
exports.createReservation = async (req, res) => {
  try {
    const { terrain, date, startTime, endTime, paymentMethod, team, notes } = req.body;

    // Vérifier que le terrain existe et est actif
    const terrainDoc = await Terrain.findById(terrain);
    if (!terrainDoc) {
      return res.status(404).json({
        success: false,
        message: 'Terrain non trouvé'
      });
    }

    if (!terrainDoc.isActive || !terrainDoc.isApproved) {
      return res.status(400).json({
        success: false,
        message: 'Ce terrain n\'est pas disponible pour la réservation'
      });
    }

    // Vérifier que la date est dans le futur
    const reservationDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (reservationDate < today) {
      return res.status(400).json({
        success: false,
        message: 'La date de réservation doit être dans le futur'
      });
    }

    // Vérifier qu'il n'y a pas de conflit horaire
    // 1. Vérifier si l'utilisateur actuel a déjà une réservation pending sur ce créneau
    const userPendingReservation = await Reservation.findOne({
      terrain,
      date: reservationDate,
      startTime,
      client: req.user.id,
      status: 'pending'
    });

    // Si l'utilisateur a déjà une réservation pending, on l'annule et on en crée une nouvelle
    if (userPendingReservation) {
      console.log('🔄 Réservation pending existante trouvée, annulation...');
      userPendingReservation.status = 'cancelled';
      userPendingReservation.cancellationReason = 'Nouvelle tentative de réservation';
      await userPendingReservation.save();
    }

    // 2. Vérifier les conflits avec d'autres utilisateurs
    const conflictingReservation = await Reservation.findOne({
      terrain,
      date: reservationDate,
      startTime,
      client: { $ne: req.user.id }, // Pas le même utilisateur
      status: { $in: ['pending', 'confirmed'] }
    });

    if (conflictingReservation) {
      return res.status(400).json({
        success: false,
        message: 'Ce créneau horaire est déjà réservé par un autre client'
      });
    }

    // Calculer la durée et les prix
    const duration = calculateDuration(startTime, endTime);
    const totalPrice = terrainDoc.pricePerHour * duration;

    // Vérifier s'il y a une promotion active
    let discount = 0;
    const activePromo = terrainDoc.promotions?.find(promo => {
      if (!promo.isActive) return false;
      const now = new Date();
      return now >= promo.startDate && now <= promo.endDate;
    });

    if (activePromo) {
      discount = (totalPrice * activePromo.discount) / 100;
    }

    const finalPrice = totalPrice - discount;

    // Vérifier l'équipe si fournie
    let teamDoc = null;
    if (team) {
      teamDoc = await Team.findById(team);
      if (!teamDoc) {
        return res.status(404).json({
          success: false,
          message: 'Équipe non trouvée'
        });
      }

      // Vérifier que l'utilisateur est membre de l'équipe
      if (!teamDoc.isMember(req.user.id)) {
        return res.status(403).json({
          success: false,
          message: 'Vous n\'êtes pas membre de cette équipe'
        });
      }
    }

    // Créer la réservation
    const reservation = await Reservation.create({
      terrain,
      client: req.user.id,
      team: team || null,
      date: reservationDate,
      startTime,
      endTime,
      duration,
      totalPrice,
      discount,
      finalPrice,
      paymentMethod,
      notes: notes || '',
      status: 'pending',
      paymentStatus: 'pending'
    });

    // Populer les références
    await reservation.populate('terrain', 'name address images');
    await reservation.populate('client', 'firstName lastName phone');
    if (team) {
      await reservation.populate('team', 'name logo');
    }

    // Mettre à jour les stats de l'équipe
    if (teamDoc) {
      teamDoc.stats.totalReservations += 1;
      teamDoc.stats.lastReservation = new Date();
      await teamDoc.save();
    }

    // Créer une notification pour le propriétaire du terrain
    await notificationService.createReservationNotification(reservation);

    res.status(201).json({
      success: true,
      message: 'Réservation créée avec succès',
      data: reservation
    });
  } catch (error) {
    console.error('Erreur createReservation:', error);
    
    // Gestion erreur duplicate key (conflit horaire)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Ce créneau horaire est déjà réservé'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la réservation',
      error: error.message
    });
  }
};

// @route   PUT /api/reservations/:id
// @desc    Update reservation
// @access  Private (Owner)
exports.updateReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    // Vérifier que l'utilisateur est le propriétaire du terrain
    const terrain = await Terrain.findById(reservation.terrain);
    if (terrain.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à modifier cette réservation'
      });
    }

    // Champs modifiables par le propriétaire
    const allowedUpdates = ['notes'];
    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const updatedReservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('terrain client team');

    res.json({
      success: true,
      message: 'Réservation mise à jour avec succès',
      data: updatedReservation
    });
  } catch (error) {
    console.error('Erreur updateReservation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la réservation',
      error: error.message
    });
  }
};

// @route   PUT /api/reservations/:id/cancel
// @desc    Cancel reservation
// @access  Private
exports.cancelReservation = async (req, res) => {
  try {
    const { cancellationReason } = req.body;
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    // Vérifier l'autorisation (client ou owner du terrain ou admin)
    const terrain = await Terrain.findById(reservation.terrain);
    const isOwner = terrain.owner.toString() === req.user.id;
    const isClient = reservation.client.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isClient && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à annuler cette réservation'
      });
    }

    // Vérifier si l'annulation est possible
    if (!reservation.canBeCancelled()) {
      return res.status(400).json({
        success: false,
        message: 'Cette réservation ne peut plus être annulée (moins de 2 heures avant le début ou déjà complétée)'
      });
    }

    reservation.status = 'cancelled';
    reservation.cancelledAt = new Date();
    reservation.cancelledBy = req.user.id;
    reservation.cancellationReason = cancellationReason || '';

    // Si payé, marquer pour remboursement
    if (reservation.paymentStatus === 'paid') {
      reservation.paymentStatus = 'refunded';
    }

    await reservation.save();

    // Populer les données pour la notification
    await reservation.populate('terrain', 'name');
    await reservation.populate('client', 'firstName lastName');

    // Si c'est le PROPRIÉTAIRE qui annule, notifier le CLIENT
    if (isOwner && !isClient) {
      await notificationService.createNotification({
        recipientId: reservation.client._id,
        type: 'reservation_cancelled',
        title: '❌ Réservation annulée',
        message: `Votre réservation pour ${reservation.terrain.name} le ${new Date(reservation.date).toLocaleDateString('fr-FR')} de ${reservation.startTime} à ${reservation.endTime} a été annulée par le propriétaire.`,
        link: '/dashboard?section=reservations',
        relatedEntity: {
          id: reservation._id,
          type: 'Reservation'
        }
      });
    }

    // Si c'est le CLIENT qui annule, notifier le PROPRIÉTAIRE
    if (isClient && !isOwner) {
      await notificationService.createNotification({
        recipientId: terrain.owner,
        type: 'reservation_cancelled',
        title: '❌ Réservation annulée',
        message: `${reservation.client.firstName} ${reservation.client.lastName} a annulé sa réservation pour ${reservation.terrain.name} le ${new Date(reservation.date).toLocaleDateString('fr-FR')}.`,
        link: '/dashboard?section=reservations',
        relatedEntity: {
          id: reservation._id,
          type: 'Reservation'
        }
      });
    }

    res.json({
      success: true,
      message: 'Réservation annulée avec succès',
      data: reservation
    });
  } catch (error) {
    console.error('Erreur cancelReservation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'annulation de la réservation',
      error: error.message
    });
  }
};

// @route   PUT /api/reservations/:id/confirm
// @desc    Confirm reservation
// @access  Private (Owner, Admin)
exports.confirmReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    // Vérifier que l'utilisateur est le propriétaire du terrain ou admin
    const terrain = await Terrain.findById(reservation.terrain);
    if (terrain.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à confirmer cette réservation'
      });
    }

    if (reservation.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Impossible de confirmer une réservation annulée'
      });
    }

    reservation.status = 'confirmed';
    reservation.confirmedAt = new Date();
    reservation.confirmedBy = req.user.id;
    await reservation.save();

    // Populer les données pour la notification
    await reservation.populate('terrain', 'name');
    await reservation.populate('client', 'firstName lastName');

    // Créer une notification pour le client
    await notificationService.createNotification({
      recipientId: reservation.client._id,
      type: 'reservation_confirmed',
      title: '✅ Réservation confirmée !',
      message: `Votre réservation pour ${reservation.terrain.name} le ${new Date(reservation.date).toLocaleDateString('fr-FR')} de ${reservation.startTime} à ${reservation.endTime} a été confirmée par le propriétaire.`,
      link: '/dashboard?section=reservations',
      relatedEntity: {
        id: reservation._id,
        type: 'Reservation'
      }
    });

    res.json({
      success: true,
      message: 'Réservation confirmée avec succès',
      data: reservation
    });
  } catch (error) {
    console.error('Erreur confirmReservation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la confirmation de la réservation',
      error: error.message
    });
  }
};

// @route   POST /api/reservations/:id/reveal-contact
// @desc    Reveal owner contact after payment
// @access  Private (Client)
exports.revealOwnerContact = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate({
        path: 'terrain',
        populate: {
          path: 'owner',
          select: 'firstName lastName phone email'
        }
      });

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    // Vérifier que c'est bien le client de cette réservation
    if (reservation.client.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé'
      });
    }

    // Vérifier que la réservation est confirmée et payée
    if (reservation.status !== 'confirmed' || reservation.paymentStatus !== 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Le contact du propriétaire est disponible uniquement après validation du paiement'
      });
    }

    // Marquer comme révélé
    if (!reservation.ownerContactRevealed) {
      reservation.ownerContactRevealed = true;
      reservation.ownerContactRevealedAt = new Date();
      await reservation.save();
    }

    res.json({
      success: true,
      data: {
        owner: {
          firstName: reservation.terrain.owner.firstName,
          lastName: reservation.terrain.owner.lastName,
          phone: reservation.terrain.owner.phone,
          email: reservation.terrain.owner.email
        },
        terrain: {
          name: reservation.terrain.name,
          address: reservation.terrain.address
        }
      }
    });
  } catch (error) {
    console.error('Erreur revealOwnerContact:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la révélation du contact',
      error: error.message
    });
  }
};

