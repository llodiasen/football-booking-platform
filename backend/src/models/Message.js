const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  terrain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Terrain',
    default: null // Optionnel, pour contexte
  },
  subject: {
    type: String,
    required: true,
    maxlength: 200
  },
  message: {
    type: String,
    required: true,
    maxlength: 2000
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date,
    default: null
  },
  conversation: {
    type: String,
    required: true,
    index: true
    // Format: "userId1-userId2" (toujours le plus petit ID en premier)
  }
}, {
  timestamps: true
});

// Index pour les conversations
messageSchema.index({ conversation: 1, createdAt: -1 });
messageSchema.index({ recipient: 1, isRead: 1 });

// Méthode pour générer l'ID de conversation
messageSchema.statics.getConversationId = function(userId1, userId2) {
  const ids = [userId1.toString(), userId2.toString()].sort();
  return `${ids[0]}-${ids[1]}`;
};

module.exports = mongoose.model('Message', messageSchema);

