const express = require('express');
const router = express.Router();
const {
  getTerrains,
  getTerrain,
  getOwnerTerrains,
  createTerrain,
  updateTerrain,
  deleteTerrain,
  getAvailability,
  addReview,
  blockTimeSlot,
  unblockTimeSlot
} = require('../controllers/terrainController');
const { protect, authorize } = require('../middleware/auth');
const { validateTerrain, handleValidationErrors } = require('../middleware/validation');

// Routes protégées - Propriétaires (AVANT les routes avec :id)
router.get('/my-terrains', protect, authorize('owner', 'admin'), getOwnerTerrains);

// Routes publiques
router.get('/', getTerrains);
router.get('/:id', getTerrain);
router.get('/:id/availability', getAvailability);

// Routes CRUD terrains
router.post('/', protect, authorize('owner', 'admin'), validateTerrain, handleValidationErrors, createTerrain);
router.put('/:id', protect, authorize('owner', 'admin'), updateTerrain);
router.delete('/:id', protect, authorize('owner', 'admin'), deleteTerrain);

// Routes disponibilité (propriétaires seulement)
router.post('/:id/block-slot', protect, authorize('owner', 'admin'), blockTimeSlot);
router.post('/:id/unblock-slot', protect, authorize('owner', 'admin'), unblockTimeSlot);

// Routes reviews
router.post('/:id/reviews', protect, addReview);

module.exports = router;

