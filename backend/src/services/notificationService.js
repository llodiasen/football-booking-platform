const Notification = require('../models/Notification');

class NotificationService {
  
  // Créer une notification pour une nouvelle réservation
  async createReservationNotification(reservation) {
    try {
      // Charger la réservation avec les infos complètes
      const fullReservation = await reservation.populate([
        { path: 'client', select: 'firstName lastName' },
        { path: 'terrain', select: 'name owner' }
      ]);

      // Créer une notification pour le propriétaire du terrain
      if (fullReservation.terrain && fullReservation.terrain.owner) {
        const notification = new Notification({
          recipient: fullReservation.terrain.owner,
          type: 'new_reservation',
          title: '🎉 Nouvelle réservation',
          message: `${fullReservation.client.firstName} ${fullReservation.client.lastName} a réservé ${fullReservation.terrain.name} le ${new Date(fullReservation.date).toLocaleDateString('fr-FR')} de ${fullReservation.startTime} à ${fullReservation.endTime}`,
          link: '/dashboard?section=reservations',
          relatedReservation: fullReservation._id,
          relatedTerrain: fullReservation.terrain._id
        });

        await notification.save();
        console.log('✅ Notification créée pour la nouvelle réservation');
        return notification;
      }
    } catch (error) {
      console.error('❌ Erreur création notification:', error);
    }
  }

  // Créer une notification pour une réservation annulée
  async createCancellationNotification(reservation, cancelledBy) {
    try {
      const fullReservation = await reservation.populate([
        { path: 'client', select: 'firstName lastName' },
        { path: 'terrain', select: 'name owner' }
      ]);

      if (fullReservation.terrain && fullReservation.terrain.owner) {
        const notification = new Notification({
          recipient: fullReservation.terrain.owner,
          type: 'reservation_cancelled',
          title: '❌ Réservation annulée',
          message: `La réservation de ${fullReservation.client.firstName} ${fullReservation.client.lastName} pour ${fullReservation.terrain.name} le ${new Date(fullReservation.date).toLocaleDateString('fr-FR')} a été annulée`,
          link: '/dashboard?section=reservations',
          relatedReservation: fullReservation._id,
          relatedTerrain: fullReservation.terrain._id
        });

        await notification.save();
        return notification;
      }
    } catch (error) {
      console.error('❌ Erreur création notification annulation:', error);
    }
  }

  // Créer une notification pour une réservation confirmée
  async createConfirmationNotification(reservation) {
    try {
      const fullReservation = await reservation.populate([
        { path: 'client', select: 'firstName lastName' },
        { path: 'terrain', select: 'name owner' }
      ]);

      if (fullReservation.terrain && fullReservation.terrain.owner) {
        const notification = new Notification({
          recipient: fullReservation.terrain.owner,
          type: 'reservation_confirmed',
          title: '✅ Réservation confirmée',
          message: `Vous avez confirmé la réservation de ${fullReservation.client.firstName} ${fullReservation.client.lastName} pour ${fullReservation.terrain.name}`,
          link: '/dashboard?section=reservations',
          relatedReservation: fullReservation._id,
          relatedTerrain: fullReservation.terrain._id
        });

        await notification.save();
        return notification;
      }
    } catch (error) {
      console.error('❌ Erreur création notification confirmation:', error);
    }
  }

  // Récupérer les notifications d'un utilisateur
  async getUserNotifications(userId, limit = 10) {
    try {
      const notifications = await Notification.find({ recipient: userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('relatedTerrain', 'name')
        .populate('relatedReservation', 'date startTime endTime');

      return notifications;
    } catch (error) {
      console.error('❌ Erreur récupération notifications:', error);
      return [];
    }
  }

  // Compter les notifications non lues
  async getUnreadCount(userId) {
    try {
      const count = await Notification.countDocuments({
        recipient: userId,
        isRead: false
      });
      return count;
    } catch (error) {
      console.error('❌ Erreur comptage notifications:', error);
      return 0;
    }
  }

  // Marquer une notification comme lue
  async markAsRead(notificationId, userId) {
    try {
      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, recipient: userId },
        { isRead: true, readAt: new Date() },
        { new: true }
      );
      return notification;
    } catch (error) {
      console.error('❌ Erreur marquage notification lue:', error);
      return null;
    }
  }

  // Marquer toutes les notifications comme lues
  async markAllAsRead(userId) {
    try {
      await Notification.updateMany(
        { recipient: userId, isRead: false },
        { isRead: true, readAt: new Date() }
      );
      return true;
    } catch (error) {
      console.error('❌ Erreur marquage toutes notifications lues:', error);
      return false;
    }
  }
}

module.exports = new NotificationService();

