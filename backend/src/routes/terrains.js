const express = require('express');
const router = express.Router();
const {
  getTerrains,
  getTerrain,
  createTerrain,
  updateTerrain,
  deleteTerrain,
  getAvailability,
  addReview
} = require('../controllers/terrainController');
const { protect, authorize } = require('../middleware/auth');
const { validateTerrain, handleValidationErrors } = require('../middleware/validation');

// Routes publiques
router.get('/', getTerrains);
router.get('/:id', getTerrain);
router.get('/:id/availability', getAvailability);

// Routes protégées
router.post('/', protect, authorize('owner', 'admin'), validateTerrain, handleValidationErrors, createTerrain);
router.put('/:id', protect, authorize('owner', 'admin'), updateTerrain);
router.delete('/:id', protect, authorize('owner', 'admin'), deleteTerrain);
router.post('/:id/reviews', protect, addReview);

module.exports = router;

