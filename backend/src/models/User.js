const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email requis'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email invalide']
  },
  password: {
    type: String,
    required: [true, 'Mot de passe requis'],
    minlength: [6, 'Mot de passe minimum 6 caractères']
  },
  firstName: {
    type: String,
    required: [true, 'Prénom requis'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Nom requis'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Téléphone requis'],
    unique: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['admin', 'owner', 'client', 'team'],
    default: 'client'
  },
  avatar: {
    type: String,
    default: null
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Profil spécifique pour les propriétaires
  ownerProfile: {
    businessName: {
      type: String,
      trim: true
    },
    businessLicense: {
      type: String,
      trim: true
    },
    approved: {
      type: Boolean,
      default: false
    },
    approvedAt: Date,
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    // Informations de paiement
    paymentInfo: {
      waveNumber: {
        type: String,
        trim: true,
        default: null
      },
      orangeMoneyNumber: {
        type: String,
        trim: true,
        default: null
      },
      freeMoneyNumber: {
        type: String,
        trim: true,
        default: null
      },
      waveQRCode: {
        type: String, // URL ou base64 de l'image QR code
        default: null
      },
      orangeMoneyQRCode: {
        type: String,
        default: null
      },
      freeMoneyQRCode: {
        type: String,
        default: null
      }
    }
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

// Index pour améliorer les performances
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ role: 1 });

// Hash password avant sauvegarde
userSchema.pre('save', async function(next) {
  // Ne hash que si le password a été modifié
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

// Méthode pour obtenir le profil public (sans password)
userSchema.methods.toPublicJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);

