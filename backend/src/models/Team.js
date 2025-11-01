const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nom de l\'équipe requis'],
    trim: true,
    minlength: [3, 'Nom minimum 3 caractères']
  },
  logo: {
    type: String,
    default: null
  },
  captain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Capitaine requis']
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    position: {
      type: String,
      enum: ['gardien', 'defenseur', 'milieu', 'attaquant'],
      default: 'milieu'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  favoriteTerrains: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Terrain'
  }],
  subscription: {
    terrain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Terrain'
    },
    plan: {
      type: String,
      enum: ['weekly', 'monthly', 'yearly']
    },
    startDate: Date,
    endDate: Date,
    isActive: {
      type: Boolean,
      default: false
    },
    discount: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    price: {
      type: Number,
      min: 0
    }
  },
  stats: {
    totalReservations: {
      type: Number,
      default: 0
    },
    totalSpent: {
      type: Number,
      default: 0
    },
    lastReservation: Date
  },
  description: {
    type: String,
    maxlength: 500
  },
  isActive: {
    type: Boolean,
    default: true
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

// Index
teamSchema.index({ captain: 1 });
teamSchema.index({ 'members.user': 1 });
teamSchema.index({ name: 1 });

// Méthode pour vérifier si un utilisateur est membre
teamSchema.methods.isMember = function(userId) {
  return this.members.some(member => 
    member.user.toString() === userId.toString() && member.isActive
  );
};

// Méthode pour vérifier si un utilisateur est le capitaine
teamSchema.methods.isCaptain = function(userId) {
  return this.captain.toString() === userId.toString();
};

// Méthode pour ajouter un membre
teamSchema.methods.addMember = function(userId, position = 'milieu') {
  // Vérifier si l'utilisateur n'est pas déjà membre
  if (this.isMember(userId)) {
    throw new Error('Utilisateur déjà membre de l\'équipe');
  }
  
  this.members.push({
    user: userId,
    position,
    joinedAt: new Date()
  });
  
  return this.save();
};

// Méthode pour retirer un membre
teamSchema.methods.removeMember = function(userId) {
  const memberIndex = this.members.findIndex(
    member => member.user.toString() === userId.toString()
  );
  
  if (memberIndex === -1) {
    throw new Error('Utilisateur n\'est pas membre de l\'équipe');
  }
  
  // Empêcher de retirer le capitaine
  if (this.captain.toString() === userId.toString()) {
    throw new Error('Impossible de retirer le capitaine');
  }
  
  this.members.splice(memberIndex, 1);
  return this.save();
};

module.exports = mongoose.model('Team', teamSchema);

