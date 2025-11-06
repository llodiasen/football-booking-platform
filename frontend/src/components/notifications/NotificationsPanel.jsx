import { useState, useEffect } from 'react';
import { Bell, Check, X, Clock, AlertCircle, CheckCircle, Trash2 } from 'lucide-react';
import { notificationAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const NotificationsPanel = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('unread'); // unread, all
  const { success: showSuccess, error: showError } = useToast();

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await notificationAPI.getAll();
      setNotifications(response.data.data || []);
    } catch (error) {
      console.error('Erreur chargement notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, isRead: true } : n
      ));
    } catch (error) {
      showError('Erreur lors du marquage comme lu');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      showSuccess('Toutes les notifications ont été marquées comme lues');
    } catch (error) {
      showError('Erreur lors du marquage des notifications');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette notification ?')) return;
    
    try {
      await notificationAPI.delete(id);
      setNotifications(notifications.filter(n => n._id !== id));
      showSuccess('Notification supprimée');
    } catch (error) {
      showError('Erreur lors de la suppression');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'reservation_confirmed':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'reservation_cancelled':
        return <X className="text-red-500" size={20} />;
      case 'new_reservation':
        return <Bell className="text-blue-500" size={20} />;
      case 'payment_received':
        return <CheckCircle className="text-green-500" size={20} />;
      default:
        return <AlertCircle className="text-gray-500" size={20} />;
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    if (seconds < 60) return 'À l\'instant';
    if (seconds < 3600) return `Il y a ${Math.floor(seconds / 60)} min`;
    if (seconds < 86400) return `Il y a ${Math.floor(seconds / 3600)}h`;
    if (seconds < 604800) return `Il y a ${Math.floor(seconds / 86400)}j`;
    return new Date(date).toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short' 
    });
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.isRead)
    : notifications;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
          <p className="text-sm text-gray-600 mt-1">
            {unreadCount > 0 ? `${unreadCount} non lue${unreadCount > 1 ? 's' : ''}` : 'Aucune notification non lue'}
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Tout marquer comme lu
          </button>
        )}
      </div>

      {/* Filtres */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-lg font-medium transition text-sm ${
            filter === 'unread'
              ? 'bg-primary-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Non lues ({unreadCount})
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition text-sm ${
            filter === 'all'
              ? 'bg-primary-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Toutes ({notifications.length})
        </button>
      </div>

      {/* Liste des notifications */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <Bell className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'unread' ? 'Aucune notification non lue' : 'Aucune notification'}
            </h3>
            <p className="text-gray-600">
              {filter === 'unread' 
                ? 'Toutes vos notifications ont été lues'
                : 'Vous n\'avez aucune notification pour le moment'
              }
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification._id}
              className={`bg-white rounded-lg p-4 border-l-4 transition hover:shadow-md ${
                notification.isRead
                  ? 'border-gray-300'
                  : 'border-primary-600 bg-primary-50/30'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-semibold text-gray-900">
                      {notification.title}
                    </h4>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {getTimeAgo(notification.createdAt)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-700 mt-1">
                    {notification.message}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-3 mt-3">
                    {notification.link && (
                      <a
                        href={notification.link}
                        className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Voir les détails →
                      </a>
                    )}
                    
                    {!notification.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(notification._id)}
                        className="text-xs text-gray-600 hover:text-gray-800 flex items-center gap-1"
                      >
                        <Check size={14} />
                        Marquer comme lu
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleDelete(notification._id)}
                      className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 ml-auto"
                    >
                      <Trash2 size={14} />
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPanel;

