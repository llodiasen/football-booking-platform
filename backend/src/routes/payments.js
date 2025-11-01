const express = require('express');
const router = express.Router();
const {
  initiatePayment,
  verifyPayment,
  handleWebhook,
  refundPayment,
  getPayments
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');
const { validatePayment, handleValidationErrors } = require('../middleware/validation');

// Routes publiques (webhooks)
router.post('/webhook/wave', handleWebhook);
router.post('/webhook/orange', handleWebhook);
router.post('/webhook/free', handleWebhook);

// Routes protégées
router.use(protect);

router.get('/', getPayments);
router.post('/initiate', validatePayment, handleValidationErrors, initiatePayment);
router.get('/verify/:id', verifyPayment);
router.post('/:id/refund', authorize('admin'), refundPayment);

module.exports = router;

