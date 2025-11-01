const express = require('express');
const router = express.Router();
const {
  getReservations,
  getReservation,
  createReservation,
  updateReservation,
  cancelReservation,
  confirmReservation
} = require('../controllers/reservationController');
const { protect, authorize } = require('../middleware/auth');
const { validateReservation, handleValidationErrors } = require('../middleware/validation');

// Toutes les routes sont protégées
router.use(protect);

router.get('/', getReservations);
router.get('/:id', getReservation);
router.post('/', validateReservation, handleValidationErrors, createReservation);
router.put('/:id', authorize('owner', 'admin'), updateReservation);
router.put('/:id/cancel', cancelReservation);
router.put('/:id/confirm', authorize('owner', 'admin'), confirmReservation);

module.exports = router;

