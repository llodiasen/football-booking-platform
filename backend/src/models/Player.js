const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
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
  
  // Informations sportives
  position: {
    type: String,
    enum: ['gardien', 'défenseur', 'milieu', 'attaquant'],
    required: [true, 'La position est requise']
  },
  preferredFoot: {
    type: String,
    enum: ['gauche', 'droit', 'ambidextre'],
    default: 'droit'
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'La date de naissance est requise']
  },
  height: {
    type: Number, // en cm
    min: [120, 'Taille invalide'],
    max: [250, 'Taille invalide']
  },
  weight: {
    type: Number, // en kg
    min: [30, 'Poids invalide'],
    max: [200, 'Poids invalide']
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
  
  // Niveau et expérience
  level: {
    type: String,
    enum: ['débutant', 'intermédiaire', 'avancé', 'expert'],
    default: 'intermédiaire'
  },
  yearsOfExperience: {
    type: Number,
    min: 0,
    default: 0
  },
  
  // Équipes
  currentTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  teamsHistory: [{
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team'
    },
    joinedAt: Date,
    leftAt: Date,
    role: String
  }],
  
  // Statistiques personnelles
  stats: {
    matchesPlayed: { type: Number, default: 0 },
    goals: { type: Number, default: 0 },
    assists: { type: Number, default: 0 },
    yellowCards: { type: Number, default: 0 },
    redCards: { type: Number, default: 0 }
  },
  
  // Disponibilités
  availability: [{
    day: {
      type: String,
      enum: ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']
    },
    timeSlots: [String] // Ex: ["18:00-20:00", "20:00-22:00"]
  }],
  
  // Recherche d'équipe
  lookingForTeam: {
    type: Boolean,
    default: false
  },
  bio: {
    type: String,
    maxlength: [300, 'La bio ne peut pas dépasser 300 caractères']
  },
  
  // Réservations personnelles
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
    default: 'player',
    immutable: true
  }
}, {
  timestamps: true
});

// Index pour la recherche
playerSchema.index({ email: 1 });
playerSchema.index({ city: 1, region: 1 });
playerSchema.index({ position: 1 });
playerSchema.index({ lookingForTeam: 1 });

// Virtuel pour calculer l'âge
playerSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// Méthode pour cacher le mot de passe
playerSchema.methods.toJSON = function() {
  const player = this.toObject({ virtuals: true });
  delete player.password;
  return player;
};

module.exports = mongoose.model('Player', playerSchema);

