const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  // Informations de base
  name: {
    type: String,
    required: [true, 'Le nom de l\'équipe est requis'],
    trim: true,
    minlength: [3, 'Le nom doit contenir au moins 3 caractères']
  },
  logo: {
    type: String,
    default: '/default-team-logo.png'
  },
  description: {
    type: String,
    maxlength: [500, 'La description ne peut pas dépasser 500 caractères']
  },
  
  // Informations du capitaine/responsable
  captain: {
    firstName: {
      type: String,
      required: [true, 'Le prénom du capitaine est requis'],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, 'Le nom du capitaine est requis'],
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
    }
  },

  // Détails de l'équipe
  category: {
    type: String,
    enum: ['amateur', 'semi-pro', 'professionnel', 'loisir'],
    default: 'amateur'
  },
  city: {
    type: String,
    required: [true, 'La ville est requise']
  },
  region: {
    type: String,
    required: [true, 'La région est requise']
  },
  foundedYear: {
    type: Number,
    min: [1900, 'Année invalide'],
    max: [new Date().getFullYear(), 'Année invalide']
  },
  
  // Membres
  members: [{
    playerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player'
    },
    role: {
      type: String,
      enum: ['player', 'substitute', 'coach', 'manager'],
      default: 'player'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Statistiques
  stats: {
    totalMatches: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    draws: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    goalsFor: { type: Number, default: 0 },
    goalsAgainst: { type: Number, default: 0 }
  },

  // Réservations de l'équipe
  reservations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reservation'
  }],

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
    default: 'team',
    immutable: true
  }
}, {
  timestamps: true
});

// Index pour la recherche
teamSchema.index({ 'captain.email': 1 });
teamSchema.index({ name: 1 });
teamSchema.index({ city: 1, region: 1 });

// Méthode pour cacher le mot de passe
teamSchema.methods.toJSON = function() {
  const team = this.toObject();
  delete team.captain.password;
  return team;
};

module.exports = mongoose.model('Team', teamSchema);
