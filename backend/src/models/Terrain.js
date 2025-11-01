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

