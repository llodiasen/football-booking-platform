const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['new_reservation', 'reservation_cancelled', 'reservation_confirmed', 'payment_received', 'terrain_approved', 'terrain_rejected', 'review_received', 'new_message'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  link: {
    type: String
  },
  relatedReservation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reservation'
  },
  relatedTerrain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Terrain'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index pour optimiser les requêtes
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);

