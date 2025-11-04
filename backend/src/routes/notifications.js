const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const notificationService = require('../services/notificationService');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const notifications = await notificationService.getUserNotifications(req.user._id, limit);
    
    res.json({
      success: true,
      data: notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des notifications'
    });
  }
});

// @desc    Get unread notifications count
// @route   GET /api/notifications/unread-count
// @access  Private
router.get('/unread-count', protect, async (req, res) => {
  try {
    const count = await notificationService.getUnreadCount(req.user._id);
    
    res.json({
      success: true,
      data: { count }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors du comptage des notifications'
    });
  }
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
router.put('/:id/read', protect, async (req, res) => {
  try {
    const notification = await notificationService.markAsRead(req.params.id, req.user._id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification non trouvée'
      });
    }
    
    res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors du marquage de la notification'
    });
  }
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/mark-all-read
// @access  Private
router.put('/mark-all-read', protect, async (req, res) => {
  try {
    await notificationService.markAllAsRead(req.user._id);
    
    res.json({
      success: true,
      message: 'Toutes les notifications ont été marquées comme lues'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors du marquage des notifications'
    });
  }
});

module.exports = router;

