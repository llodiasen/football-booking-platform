import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MessageCircle, Send, User, Clock, ArrowLeft, Trash2, Search, Smile, Paperclip, MoreVertical, Phone, Video } from 'lucide-react';
import { messageAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { playNotificationSound } from '../../utils/notificationSound';

const MessagesPanel = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const conversationWithUserId = searchParams.get('conversationWith'); // ID de l'utilisateur pour ouvrir la conversation
  
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [previousMessageCount, setPreviousMessageCount] = useState(0);
  const messagesEndRef = useRef(null);
  const { success: showSuccess, error: showError } = useToast();

  // Auto-scroll vers le bas quand de nouveaux messages arrivent
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    
    // Détecter nouveaux messages et jouer un son
    if (messages.length > previousMessageCount && previousMessageCount > 0) {
      const latestMessage = messages[messages.length - 1];
      
      // Si le dernier message n'est pas du user actuel (message reçu)
      if (latestMessage.sender._id !== user.id && latestMessage.sender._id !== user._id) {
        playNotificationSound();
        
        // Notification visuelle du navigateur
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('💬 Nouveau message', {
            body: `${latestMessage.sender.firstName}: ${latestMessage.message.substring(0, 50)}...`,
            icon: '/logo.png'
          });
        }
      }
    }
    
    setPreviousMessageCount(messages.length);
  }, [messages]);

  useEffect(() => {
    loadConversations();
    
    // Demander permission pour les notifications
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    
    // Polling pour nouveaux messages toutes les 5 secondes
    const interval = setInterval(() => {
      loadConversations();
      
      // Recharger la conversation active si ouverte
      if (selectedConversation) {
        loadConversation(selectedConversation.otherPerson._id);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedConversation]);

  const loadConversations = async () => {
    try {
      const response = await messageAPI.getConversations();
      const convs = response.data.data || [];
      setConversations(convs);
      
      // Si un paramètre conversationWith est présent, ouvrir automatiquement cette conversation
      if (conversationWithUserId && convs.length > 0) {
        const targetConversation = convs.find(c => c.otherPerson._id === conversationWithUserId);
        if (targetConversation) {
          setSelectedConversation(targetConversation);
          loadConversation(targetConversation.otherPerson._id);
        }
      }
    } catch (error) {
      console.error('Erreur chargement conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadConversation = async (userId) => {
    try {
      const response = await messageAPI.getConversation(userId);
      setMessages(response.data.data || []);
    } catch (error) {
      showError('Erreur lors du chargement de la conversation');
    }
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    loadConversation(conversation.otherPerson._id);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedConversation) return;

    setSending(true);
    try {
      await messageAPI.send({
        recipientId: selectedConversation.otherPerson._id,
        subject: `Re: ${messages[0]?.subject || 'Discussion'}`,
        message: newMessage
      });

      setNewMessage('');
      loadConversation(selectedConversation.otherPerson._id);
      loadConversations(); // Rafraîchir la liste
      showSuccess('Message envoyé');
    } catch (error) {
      showError('Erreur lors de l\'envoi');
    } finally {
      setSending(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const filteredConversations = conversations.filter(conv =>
    conv.otherPerson.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.otherPerson.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-gray-50 rounded-2xl overflow-hidden" style={{ height: 'calc(100vh - 220px)' }}>
      <div className="flex h-full gap-0">
        {/* Liste des conversations (Gauche) - Style moderne */}
        <div className={`${selectedConversation ? 'hidden lg:flex' : 'flex'} w-full lg:w-80 flex-col bg-white rounded-2xl shadow-sm overflow-hidden`}>
          {/* Header avec recherche */}
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Conversations</h3>
            
            {/* Barre de recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Conversations - Liste épurée */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center">
                <MessageCircle className="mx-auto text-gray-400 mb-3" size={48} />
                <p className="text-sm text-gray-600">
                  {searchQuery ? 'Aucun résultat' : 'Aucune conversation'}
                </p>
              </div>
            ) : (
              <div className="py-2">
                {filteredConversations.map((conv) => (
                  <button
                    key={conv.conversationId}
                    onClick={() => handleSelectConversation(conv)}
                    className={`w-full px-4 py-3 transition-all text-left relative ${
                      selectedConversation?.conversationId === conv.conversationId 
                        ? 'bg-green-50 border-l-4 border-green-600' 
                        : 'hover:bg-gray-50 border-l-4 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Avatar avec photo de profil simulée */}
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-base shadow-sm">
                          {conv.otherPerson.firstName?.charAt(0)}{conv.otherPerson.lastName?.charAt(0)}
                        </div>
                        {/* Indicateur en ligne (online) */}
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between mb-0.5">
                          <h4 className="font-semibold text-gray-900 text-sm truncate">
                            {conv.otherPerson.firstName} {conv.otherPerson.lastName}
                          </h4>
                          <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                            {new Date(conv.lastMessage.createdAt).toLocaleTimeString('fr-FR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                        <p className={`text-xs truncate ${
                          conv.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-600'
                        }`}>
                          {conv.lastMessage.message}
                        </p>
                      </div>

                      {/* Badge non lu */}
                      {conv.unreadCount > 0 && (
                        <div className="absolute top-3 right-3 w-2 h-2 bg-green-600 rounded-full"></div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Conversation (Centre) - Style moderne */}
        <div className={`${selectedConversation ? 'flex' : 'hidden lg:flex'} flex-1 flex-col bg-white rounded-2xl shadow-sm overflow-hidden`}>
          {selectedConversation ? (
            <>
              {/* Header Conversation - Design moderne */}
              <div className="px-6 py-4 border-b border-gray-100 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setSelectedConversation(null)}
                      className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    
                    {/* Avatar avec indicateur en ligne */}
                    <div className="relative">
                      <div className="w-11 h-11 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-base shadow-sm">
                        {selectedConversation.otherPerson.firstName?.charAt(0)}{selectedConversation.otherPerson.lastName?.charAt(0)}
                      </div>
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-gray-900 text-base">
                        {selectedConversation.otherPerson.firstName} {selectedConversation.otherPerson.lastName}
                      </h4>
                      <p className="text-xs text-green-600 font-medium">En ligne</p>
                    </div>
                  </div>

                  {/* Actions rapides */}
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Appeler">
                      <Phone size={18} className="text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Vidéo">
                      <Video size={18} className="text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Plus">
                      <MoreVertical size={18} className="text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages - Amélioration de la lisibilité */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <MessageCircle className="mx-auto text-gray-400 mb-3" size={48} />
                      <p className="text-sm text-gray-600">Commencez la conversation</p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg, index) => {
                    const isMe = msg.sender._id !== selectedConversation.otherPerson._id;
                    const showAvatar = index === messages.length - 1 || messages[index + 1]?.sender._id !== msg.sender._id;
                    const showTime = showAvatar;
                    
                    return (
                      <div key={msg._id} className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                        {/* Avatar (seulement pour le dernier message de chaque série) */}
                        {!isMe && (
                          <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-sm mb-1" style={{ visibility: showAvatar ? 'visible' : 'hidden' }}>
                            {selectedConversation.otherPerson.firstName?.charAt(0)}
                          </div>
                        )}

                        {/* Bulle de message - Design moderne épuré */}
                        <div className={`max-w-[70%] ${isMe ? '' : ''}`}>
                          {msg.subject && index === 0 && (
                            <div className={`mb-2 ${isMe ? 'text-right' : 'text-left'}`}>
                              <span className="inline-block bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
                                📌 {msg.subject}
                              </span>
                            </div>
                          )}
                          <div className={`${
                            isMe 
                              ? 'bg-green-600 text-white rounded-tr-sm' 
                              : 'bg-white text-gray-900 border border-gray-200 rounded-tl-sm'
                          } rounded-2xl px-4 py-2.5 shadow-sm`}>
                            <p className="text-[13px] leading-relaxed whitespace-pre-wrap break-words">{msg.message}</p>
                          </div>
                          {showTime && (
                            <p className={`text-[11px] mt-1 px-1 text-gray-500 ${isMe ? 'text-right' : 'text-left'}`}>
                              {new Date(msg.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Référence pour auto-scroll */}
              <div ref={messagesEndRef} />

              {/* Input message - Style moderne comme la capture */}
              <form onSubmit={handleSendMessage} className="px-6 py-4 border-t border-gray-100 bg-white">
                <div className="flex items-center gap-3">
                  {/* Boutons actions */}
                  <button
                    type="button"
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                    title="Émojis"
                  >
                    <Smile size={20} />
                  </button>
                  <button
                    type="button"
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                    title="Joindre un fichier"
                  >
                    <Paperclip size={20} />
                  </button>

                  {/* Input */}
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          if (newMessage.trim() && !sending) {
                            handleSendMessage(e);
                          }
                        }
                      }}
                      placeholder="Écrivez votre message..."
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      disabled={sending}
                    />
                  </div>

                  {/* Bouton envoyer */}
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    className="bg-green-600 hover:bg-green-700 text-white p-2.5 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                    title="Envoyer"
                  >
                    {sending ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <Send size={18} />
                    )}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-center bg-gray-50">
              <div>
                <MessageCircle className="mx-auto text-gray-400 mb-4" size={64} />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Sélectionnez une conversation</h3>
                <p className="text-sm text-gray-600">
                  Choisissez une conversation dans la liste pour commencer à discuter
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPanel;

