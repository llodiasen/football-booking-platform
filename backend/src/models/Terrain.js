const mongoose = require('mongoose');

const terrainSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nom du terrain requis'],
    trim: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Propriétaire requis']
  },
  description: {
    type: String,
    required: [true, 'Description requise'],
    minlength: [20, 'Description minimum 20 caractères']
  },
  address: {
    street: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      required: [true, 'Ville requise'],
      trim: true
    },
    region: {
      type: String,
      required: [true, 'Région requise'],
      trim: true
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        index: '2dsphere'
      }
    }
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    isMain: {
      type: Boolean,
      default: false
    }
  }],
  type: {
    type: String,
    enum: ['synthetique', 'naturel', 'stabilise'],
    default: 'synthetique'
  },
  size: {
    type: String,
    enum: ['5x5', '7x7', '11x11'],
    required: [true, 'Taille du terrain requise']
  },
  amenities: [{
    type: String,
    enum: ['vestiaires', 'douches', 'parking', 'eclairage', 'tribune', 'cafeteria', 'wifi']
  }],
  pricePerHour: {
    type: Number,
    required: [true, 'Prix requis'],
    min: [0, 'Prix doit être positif']
  },
  pricing: {
    useAdvancedPricing: {
      type: Boolean,
      default: false
    },
    weekdayPrice: {
      type: Number,
      min: 0
    },
    weekendPrice: {
      type: Number,
      min: 0
    },
    timeSlots: [{
      name: String,  // Ex: "Happy Hour", "Peak Hours"
      days: [{
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
      }],
      startTime: String,  // Format: "HH:mm"
      endTime: String,    // Format: "HH:mm"
      price: {
        type: Number,
        min: 0
      },
      active: {
        type: Boolean,
        default: true
      }
    }]
  },
  bookingRules: {
    advancePayment: {
      required: {
        type: Boolean,
        default: false
      },
      amount: {
        type: Number,
        min: 0,
        default: 0
      },
      type: {
        type: String,
        enum: ['fixed', 'percentage'], // 'fixed' = montant fixe, 'percentage' = pourcentage
        default: 'percentage'
      }
    },
    instructions: {
      type: String,
      maxlength: [1000, 'Instructions maximum 1000 caractères'],
      default: 'Merci d\'arriver 15 minutes avant l\'heure de réservation pour récupérer les clés et accéder aux vestiaires.'
    },
    cancellationPolicy: {
      type: String,
      maxlength: [500, 'Politique d\'annulation maximum 500 caractères'],
      default: 'Annulation gratuite jusqu\'à 24h avant la réservation.'
    },
    rules: [{
      type: String,
      maxlength: [200, 'Règle maximum 200 caractères']
    }]
  },
  openingHours: {
    monday: {
      open: String,
      close: String,
      closed: { type: Boolean, default: false }
    },
    tuesday: {
      open: String,
      close: String,
      closed: { type: Boolean, default: false }
    },
    wednesday: {
      open: String,
      close: String,
      closed: { type: Boolean, default: false }
    },
    thursday: {
      open: String,
      close: String,
      closed: { type: Boolean, default: false }
    },
    friday: {
      open: String,
      close: String,
      closed: { type: Boolean, default: false }
    },
    saturday: {
      open: String,
      close: String,
      closed: { type: Boolean, default: false }
    },
    sunday: {
      open: String,
      close: String,
      closed: { type: Boolean, default: false }
    }
  },
  promotions: [{
    name: {
      type: String,
      required: true
    },
    discount: {
      type: Number,
      min: 0,
      max: 100
    },
    startDate: Date,
    endDate: Date,
    isActive: {
      type: Boolean,
      default: false
    }
  }],
  discounts: [{
    type: {
      type: String,
      enum: ['duration', 'promo_code', 'time_slot', 'first_booking'],
      required: true
    },
    name: {
      type: String,
      required: true
    },
    description: String,
    value: {
      type: Number,
      required: true,
      min: 0
    },
    valueType: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'percentage'
    },
    conditions: {
      minDuration: Number,  // Pour type 'duration'
      promoCode: String,    // Pour type 'promo_code'
      timeSlot: {           // Pour type 'time_slot'
        startTime: String,
        endTime: String,
        days: [String]
      },
      maxUses: Number,      // Nombre max d'utilisations
      usedCount: {
        type: Number,
        default: 0
      }
    },
    validFrom: Date,
    validUntil: Date,
    active: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      maxlength: 500
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  customAvailability: [{
    date: {
      type: Date,
      required: true
    },
    blockedSlots: [{
      startTime: {
        type: String,
        required: true
      },
      endTime: {
        type: String,
        required: true
      },
      reason: {
        type: String,
        enum: ['maintenance', 'private_event', 'closed', 'other'],
        default: 'other'
      },
      note: {
        type: String,
        maxlength: 200
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }]
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  // Nouveaux champs pour enrichir les fiches produits
  highlights: [{
    type: String,
    maxlength: 200
  }],
  neighborhoodHighlights: [{
    category: {
      type: String,
      enum: ['Transport', 'Commerce', 'Parking', 'Santé', 'Loisirs', 'Education']
    },
    items: [{
      type: String,
      maxlength: 100
    }]
  }],
  additionalServices: [{
    type: String,
    maxlength: 150
  }],
  safetyInfo: [{
    type: String,
    maxlength: 150
  }],
  accessibility: {
    wheelchairAccess: {
      type: Boolean,
      default: false
    },
    parkingPMR: {
      type: Boolean,
      default: false
    },
    elevatorAvailable: {
      type: Boolean,
      default: false
    },
    adaptedToilets: {
      type: Boolean,
      default: false
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

// Index pour la recherche géographique et les filtres
terrainSchema.index({ 'address.coordinates': '2dsphere' });
terrainSchema.index({ 'address.city': 1 });
terrainSchema.index({ 'address.region': 1 });
terrainSchema.index({ pricePerHour: 1 });
terrainSchema.index({ 'rating.average': -1 });
terrainSchema.index({ owner: 1 });
terrainSchema.index({ isActive: 1, isApproved: 1 });

// Index text pour la recherche
terrainSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Terrain', terrainSchema);

