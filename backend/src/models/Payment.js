const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  reservation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reservation',
    required: [true, 'Réservation requise']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Utilisateur requis']
  },
  amount: {
    type: Number,
    required: [true, 'Montant requis'],
    min: [0, 'Montant doit être positif']
  },
  currency: {
    type: String,
    default: 'XOF', // Franc CFA
    enum: ['XOF', 'USD', 'EUR']
  },
  method: {
    type: String,
    enum: ['wave', 'orange_money', 'free_money', 'cash'],
    required: [true, 'Méthode de paiement requise']
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed', 'refunded'],
    default: 'pending'
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true // Permet d'avoir plusieurs null
  },
  phoneNumber: {
    type: String,
    required: [true, 'Numéro de téléphone requis'],
    trim: true
  },
  metadata: {
    type: Map,
    of: String
  },
  errorMessage: {
    type: String
  },
  attempts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date,
  refundedAt: Date,
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index
paymentSchema.index({ reservation: 1 });
paymentSchema.index({ user: 1 });
paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ method: 1 });
paymentSchema.index({ createdAt: -1 });

// Méthode pour marquer le paiement comme réussi
paymentSchema.methods.markAsSuccess = function(transactionId) {
  this.status = 'success';
  this.transactionId = transactionId;
  this.completedAt = new Date();
  return this.save();
};

// Méthode pour marquer le paiement comme échoué
paymentSchema.methods.markAsFailed = function(errorMessage) {
  this.status = 'failed';
  this.errorMessage = errorMessage;
  this.attempts += 1;
  return this.save();
};

// Méthode pour rembourser
paymentSchema.methods.refund = function() {
  if (this.status !== 'success') {
    throw new Error('Seuls les paiements réussis peuvent être remboursés');
  }
  
  this.status = 'refunded';
  this.refundedAt = new Date();
  return this.save();
};

module.exports = mongoose.model('Payment', paymentSchema);

