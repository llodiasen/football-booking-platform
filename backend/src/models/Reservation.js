const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  terrain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Terrain',
    required: [true, 'Terrain requis']
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Client requis']
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    default: null
  },
  date: {
    type: Date,
    required: [true, 'Date requise']
  },
  startTime: {
    type: String,
    required: [true, 'Heure de début requise'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format heure invalide (HH:MM)']
  },
  endTime: {
    type: String,
    required: [true, 'Heure de fin requise'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format heure invalide (HH:MM)']
  },
  duration: {
    type: Number, // en heures
    required: [true, 'Durée requise'],
    min: [0.5, 'Durée minimum 30 minutes']
  },
  totalPrice: {
    type: Number,
    required: [true, 'Prix total requis'],
    min: [0, 'Prix doit être positif']
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  finalPrice: {
    type: Number,
    required: [true, 'Prix final requis'],
    min: [0, 'Prix doit être positif']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['wave', 'orange_money', 'free_money'],
    required: [true, 'Méthode de paiement requise']
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  },
  notes: {
    type: String,
    maxlength: 500,
    default: ''
  },
  ownerContactRevealed: {
    type: Boolean,
    default: false
  },
  ownerContactRevealedAt: Date,
  cancelledAt: Date,
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  cancellationReason: {
    type: String,
    maxlength: 500
  },
  confirmedAt: Date,
  confirmedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  completedAt: Date,
  paymentReference: {
    type: String,
    default: null
  },
  paytechToken: {
    type: String,
    default: null
  },
  paidAt: Date,
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

// Index unique pour éviter les réservations en double (seulement pour les réservations actives)
reservationSchema.index(
  { terrain: 1, date: 1, startTime: 1 }, 
  { 
    unique: true,
    partialFilterExpression: { status: { $in: ['pending', 'confirmed', 'completed'] } }
  }
);

// Index pour les requêtes fréquentes
reservationSchema.index({ client: 1, status: 1 });
reservationSchema.index({ terrain: 1, date: 1 });
reservationSchema.index({ status: 1, date: 1 });
reservationSchema.index({ paymentStatus: 1 });

// Méthode pour vérifier si la réservation peut être annulée
reservationSchema.methods.canBeCancelled = function() {
  if (this.status === 'cancelled' || this.status === 'completed') {
    return false;
  }
  
  // Vérifier si la réservation est dans le futur
  const now = new Date();
  const reservationDate = new Date(this.date);
  const [hours, minutes] = this.startTime.split(':').map(Number);
  reservationDate.setHours(hours, minutes, 0, 0);
  
  // Peut annuler si plus de 2 heures avant le début
  const hoursUntilReservation = (reservationDate - now) / (1000 * 60 * 60);
  return hoursUntilReservation > 2;
};

module.exports = mongoose.model('Reservation', reservationSchema);

