import { useState, useEffect, useRef } from 'react';
import { Bell, X, Check, Trash2 } from 'lucide-react';
import { notificationAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Link, useNavigate } from 'react-router-dom';
import NotificationDetailModal from './NotificationDetailModal';
import { playNotificationSound } from '../../utils/notificationSound';

const NotificationDropdown = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const dropdownRef = useRef(null);
  const { success: showSuccess, error: showError } = useToast();

  useEffect(() => {
    loadNotifications();
    
    // Demander la permission pour les notifications système
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('✅ Notifications système activées');
        }
      });
    }
    
    // Polling toutes les 10 secondes pour vérifier les nouvelles notifications
    const interval = setInterval(() => {
      loadNotifications(true); // Activer le son pour les nouvelles notifications
    }, 10000); // 10 secondes
    
    // Fermer le dropdown si on clique en dehors
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      clearInterval(interval);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [unreadCount]); // Dépendance sur unreadCount pour comparer

  const loadNotifications = async (playSound = false) => {
    setLoading(true);
    try {
      const response = await notificationAPI.getAll();
      const notifs = response.data.data || [];
      const newUnreadCount = notifs.filter(n => !n.isRead).length;
      
      // Si le nombre de non lues augmente et que playSound est activé
      if (playSound && newUnreadCount > unreadCount) {
        // Trouver les nouvelles notifications non lues
        const existingIds = notifications.map(n => n._id);
        const newNotifications = notifs.filter(n => !n.isRead && !existingIds.includes(n._id));
        
        if (newNotifications.length > 0) {
          // Jouer le son
          playNotificationSound();
          
          // Afficher une notification système pour les changements de statut importants et nouveaux messages
          newNotifications.forEach(notif => {
            if (['reservation_confirmed', 'reservation_cancelled', 'new_message', 'new_reservation'].includes(notif.type)) {
              if ('Notification' in window && Notification.permission === 'granted') {
                const emojiMap = {
                  'reservation_confirmed': '✅',
                  'reservation_cancelled': '❌',
                  'new_message': '💬',
                  'new_reservation': '🎉'
                };
                const emoji = emojiMap[notif.type] || '🔔';
                
                new Notification(`${emoji} ${notif.title}`, {
                  body: notif.message,
                  icon: '/logo.png',
                  badge: '/logo.png',
                  tag: notif._id, // Éviter les doublons
                  requireInteraction: notif.type === 'new_message' // Rester visible pour les messages
                });
              }
            }
          });
        }
      }
      
      setNotifications(notifs.slice(0, 5)); // Afficher les 5 dernières
      setUnreadCount(newUnreadCount);
    } catch (error) {
      console.error('Erreur chargement notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await notificationAPI.markAsRead(id);
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, isRead: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      showError('Erreur lors du marquage');
    }
  };

  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await notificationAPI.delete(id);
      const deletedNotif = notifications.find(n => n._id === id);
      setNotifications(notifications.filter(n => n._id !== id));
      if (!deletedNotif?.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      showSuccess('Notification supprimée');
    } catch (error) {
      showError('Erreur lors de la suppression');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      showSuccess('Toutes les notifications ont été lues');
    } catch (error) {
      showError('Erreur lors du marquage');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'reservation_confirmed':
        return '✅';
      case 'reservation_cancelled':
        return '❌';
      case 'new_reservation':
        return '🎉';
      case 'payment_received':
        return '💰';
      default:
        return '📢';
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

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bouton cloche */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell size={20} className="text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown - Responsive et adaptatif */}
      {isOpen && (
        <div className="absolute left-auto right-0 sm:right-0 top-full mt-2 w-[min(calc(100vw-16px),24rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden max-h-[80vh]">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-3">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold text-lg">Notifications</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 p-1 rounded transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            {unreadCount > 0 && (
              <p className="text-primary-100 text-xs mt-1">
                {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Actions */}
          {unreadCount > 0 && (
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-primary-600 hover:text-primary-700 font-medium"
              >
                Tout marquer comme lu
              </button>
            </div>
          )}

          {/* Liste des notifications */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="mx-auto text-gray-400 mb-3" size={40} />
                <p className="text-gray-600 text-sm">Aucune notification</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    onClick={() => {
                      if (!notification.isRead) {
                        handleMarkAsRead(notification._id, { preventDefault: () => {}, stopPropagation: () => {} });
                      }
                      
                      // Rediriger vers la section appropriée du dashboard
                      if (notification.link) {
                        navigate(notification.link);
                      }
                      
                      // Ouvrir la modal avec les détails
                      setSelectedNotification(notification);
                      setIsOpen(false);
                    }}
                    className={`block px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                      !notification.isRead ? 'bg-primary-50/30' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icône */}
                      <span className="text-2xl flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </span>

                      {/* Contenu */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className={`text-sm font-semibold ${
                            !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                          </h4>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0 mt-1"></div>
                          )}
                        </div>
                        
                        <p className="text-xs text-gray-600 line-clamp-2 mb-1">
                          {notification.message}
                        </p>

                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">
                            {getTimeAgo(notification.createdAt)}
                          </span>

                          {/* Actions */}
                          <div className="flex items-center gap-1">
                            {!notification.isRead && (
                              <button
                                onClick={(e) => handleMarkAsRead(notification._id, e)}
                                className="p-1 hover:bg-gray-200 rounded transition-colors"
                                title="Marquer comme lu"
                              >
                                <Check size={14} className="text-gray-600" />
                              </button>
                            )}
                            <button
                              onClick={(e) => handleDelete(notification._id, e)}
                              className="p-1 hover:bg-red-100 rounded transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 size={14} className="text-red-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <Link
              to="/dashboard?section=notifications"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 text-center text-sm text-primary-600 hover:bg-gray-50 font-medium border-t border-gray-100"
            >
              Voir toutes les notifications →
            </Link>
          )}
        </div>
      )}

      {/* Modal de détails */}
      {selectedNotification && (
        <NotificationDetailModal
          notification={selectedNotification}
          onClose={() => setSelectedNotification(null)}
          onActionComplete={() => {
            // Rafraîchir les notifications après une action
            loadNotifications();
          }}
        />
      )}
    </div>
  );
};

export default NotificationDropdown;

