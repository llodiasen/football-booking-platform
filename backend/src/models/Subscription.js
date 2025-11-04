const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  terrain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Terrain',
    required: true
  },
  plan: {
    type: String,
    enum: ['weekly', 'monthly'],
    required: true
  },
  // Jour de la semaine pour abonnement hebdomadaire
  weeklyDay: {
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  },
  // Créneau horaire récurrent
  timeSlot: {
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    }
  },
  // Dates de validité
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  // Prix et paiement
  pricePerSession: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'cancelled', 'expired'],
    default: 'active'
  },
  // Paiement
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['wave', 'orange_money', 'credit_card', 'bank_transfer']
  },
  // Métadonnées
  sessionsCount: {
    type: Number,
    default: 0
  },
  autoRenew: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    maxlength: 500
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index pour recherche
subscriptionSchema.index({ user: 1, status: 1 });
subscriptionSchema.index({ terrain: 1, status: 1 });
subscriptionSchema.index({ endDate: 1 });

module.exports = mongoose.model('Subscription', subscriptionSchema);

