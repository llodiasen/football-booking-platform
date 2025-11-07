const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
  // Informations personnelles
  firstName: {
    type: String,
    required: [true, 'Le prénom est requis'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email invalide']
  },
  phone: {
    type: String,
    required: [true, 'Le numéro de téléphone est requis'],
    match: [/^[+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/, 'Numéro invalide']
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères']
  },
  
  // Photo de profil
  avatar: {
    type: String,
    default: '/default-avatar.png'
  },
  
  // Localisation
  city: {
    type: String,
    required: [true, 'La ville est requise']
  },
  region: {
    type: String,
    required: [true, 'La région est requise']
  },
  address: {
    street: String,
    postalCode: String
  },
  
  // Préférences de notification
  notifications: {
    email: {
      type: Boolean,
      default: true
    },
    sms: {
      type: Boolean,
      default: false
    },
    push: {
      type: Boolean,
      default: true
    }
  },
  
  // Abonnements et intérêts
  interests: [{
    type: String,
    enum: ['football', 'tournois', 'équipes', 'terrains', 'événements']
  }],
  favoriteTeams: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  }],
  favoriteTerrains: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Terrain'
  }],
  followedPlayers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  }],
  
  // Abonnement premium (optionnel)
  subscription: {
    type: {
      type: String,
      enum: ['free', 'basic', 'premium', 'vip'],
      default: 'free'
    },
    startDate: Date,
    endDate: Date,
    isActive: {
      type: Boolean,
      default: false
    },
    autoRenew: {
      type: Boolean,
      default: false
    }
  },
  
  // Historique de participation
  attendedEvents: [{
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'attendedEvents.eventType'
    },
    eventType: {
      type: String,
      enum: ['Match', 'Tournament', 'Event']
    },
    attendedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Réservations pour assister à des matchs
  matchReservations: [{
    matchId: mongoose.Schema.Types.ObjectId,
    seats: Number,
    ticketType: {
      type: String,
      enum: ['standard', 'vip', 'premium']
    },
    price: Number,
    reservedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Statistiques d'engagement
  stats: {
    eventsAttended: { type: Number, default: 0 },
    teamsFollowed: { type: Number, default: 0 },
    playersFollowed: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 }
  },
  
  // Statut
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    default: 'subscriber',
    immutable: true
  },
  
  // Date de dernière connexion
  lastLoginAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index pour la recherche
subscriberSchema.index({ email: 1 });
subscriberSchema.index({ city: 1, region: 1 });
subscriberSchema.index({ 'subscription.type': 1 });
subscriberSchema.index({ 'subscription.isActive': 1 });

// Méthode pour cacher le mot de passe
subscriberSchema.methods.toJSON = function() {
  const subscriber = this.toObject();
  delete subscriber.password;
  return subscriber;
};

// Méthode pour vérifier si l'abonnement est actif
subscriberSchema.methods.hasActiveSubscription = function() {
  if (!this.subscription.isActive) return false;
  if (!this.subscription.endDate) return false;
  return new Date() < new Date(this.subscription.endDate);
};

module.exports = mongoose.model('Subscriber', subscriberSchema);

