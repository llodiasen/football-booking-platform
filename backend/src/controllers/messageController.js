const Message = require('../models/Message');
const User = require('../models/User');
const Terrain = require('../models/Terrain');
const notificationService = require('../services/notificationService');

// @route   POST /api/messages
// @desc    Envoyer un message
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { recipientId, terrainId, subject, message } = req.body;

    if (!recipientId || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Destinataire, sujet et message requis'
      });
    }

    // Vérifier que le destinataire existe
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Destinataire non trouvé'
      });
    }

    // Générer l'ID de conversation
    const conversationId = Message.getConversationId(req.user.id, recipientId);

    // Créer le message
    const newMessage = await Message.create({
      sender: req.user.id,
      recipient: recipientId,
      terrain: terrainId || null,
      subject,
      message,
      conversation: conversationId
    });

    // Populer les données
    await newMessage.populate('sender', 'firstName lastName email');
    await newMessage.populate('recipient', 'firstName lastName email');
    if (terrainId) {
      await newMessage.populate('terrain', 'name');
    }

    // Créer une notification pour le destinataire avec lien vers la conversation
    await notificationService.createNotification({
      recipientId: recipientId,
      type: 'new_message',
      title: '💬 Nouveau message',
      message: `${newMessage.sender.firstName} ${newMessage.sender.lastName} vous a envoyé un message : "${subject}"`,
      link: `/dashboard?section=messages&conversationWith=${req.user.id}`, // Inclure l'ID de l'expéditeur
      relatedEntity: {
        id: newMessage._id,
        type: 'Message'
      }
    });

    res.status(201).json({
      success: true,
      message: 'Message envoyé avec succès',
      data: newMessage
    });
  } catch (error) {
    console.error('Erreur sendMessage:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi du message',
      error: error.message
    });
  }
};

// @route   GET /api/messages/conversations
// @desc    Obtenir toutes les conversations de l'utilisateur
// @access  Private
exports.getConversations = async (req, res) => {
  try {
    // Trouver tous les messages où l'utilisateur est soit sender soit recipient
    const messages = await Message.find({
      $or: [
        { sender: req.user.id },
        { recipient: req.user.id }
      ]
    })
      .populate('sender', 'firstName lastName email')
      .populate('recipient', 'firstName lastName email')
      .populate('terrain', 'name')
      .sort('-createdAt');

    // Grouper par conversation
    const conversationsMap = new Map();

    messages.forEach(msg => {
      const conversationId = msg.conversation;
      
      if (!conversationsMap.has(conversationId)) {
        // Déterminer l'autre personne dans la conversation
        const otherPerson = msg.sender._id.toString() === req.user.id 
          ? msg.recipient 
          : msg.sender;

        conversationsMap.set(conversationId, {
          conversationId,
          otherPerson: {
            _id: otherPerson._id,
            firstName: otherPerson.firstName,
            lastName: otherPerson.lastName,
            email: otherPerson.email
          },
          lastMessage: msg,
          unreadCount: 0
        });
      }

      // Compter les messages non lus
      if (!msg.isRead && msg.recipient._id.toString() === req.user.id) {
        conversationsMap.get(conversationId).unreadCount++;
      }
    });

    const conversations = Array.from(conversationsMap.values());

    res.json({
      success: true,
      data: conversations
    });
  } catch (error) {
    console.error('Erreur getConversations:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des conversations',
      error: error.message
    });
  }
};

// @route   GET /api/messages/conversation/:userId
// @desc    Obtenir tous les messages d'une conversation avec un utilisateur
// @access  Private
exports.getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const conversationId = Message.getConversationId(req.user.id, userId);

    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'firstName lastName email')
      .populate('recipient', 'firstName lastName email')
      .populate('terrain', 'name')
      .sort('createdAt');

    // Marquer les messages reçus comme lus
    await Message.updateMany(
      {
        conversation: conversationId,
        recipient: req.user.id,
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );

    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('Erreur getConversation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la conversation',
      error: error.message
    });
  }
};

// @route   GET /api/messages/unread-count
// @desc    Obtenir le nombre de messages non lus
// @access  Private
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      recipient: req.user.id,
      isRead: false
    });

    res.json({
      success: true,
      data: {
        unreadCount: count
      }
    });
  } catch (error) {
    console.error('Erreur getUnreadCount:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du comptage des messages non lus',
      error: error.message
    });
  }
};

// Les fonctions sont déjà exportées avec exports.functionName ci-dessus
// Pas besoin de module.exports en plus

