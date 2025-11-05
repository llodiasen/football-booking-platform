const express = require('express');
const { protect } = require('../middleware/auth');
const {
  initiatePayment,
  handleCallback,
  checkPaymentStatus
} = require('../controllers/paytechController');

const router = express.Router();

// Initier un paiement PayTech (protégé, nécessite authentification)
router.post('/initiate', protect, initiatePayment);

// Callback IPN de PayTech (public, appelé par PayTech)
router.post('/callback', handleCallback);

// Vérifier le statut d'un paiement (protégé)
router.get('/status/:token', protect, checkPaymentStatus);

module.exports = router;

