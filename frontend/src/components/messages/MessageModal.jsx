import { useState } from 'react';
import { X, Send, User } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import Button from '../ui/Button';

const MessageModal = ({ terrain, onClose, onSend }) => {
  const [formData, setFormData] = useState({
    subject: `Question sur ${terrain?.name || 'le terrain'}`,
    message: ''
  });
  const [sending, setSending] = useState(false);
  const { success: showSuccess, error: showError } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.message.trim()) {
      showError('Veuillez saisir un message');
      return;
    }

    setSending(true);
    try {
      await onSend(formData);
      showSuccess('Message envoyé avec succès !');
      onClose();
    } catch (error) {
      showError(error.response?.data?.message || 'Erreur lors de l\'envoi du message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Send className="text-white" size={20} />
              </div>
              <div className="text-white">
                <h2 className="text-xl font-bold">Envoyer un message</h2>
                <p className="text-sm text-green-100">Contactez le propriétaire</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Owner Info */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
              {terrain?.owner?.firstName?.charAt(0).toUpperCase() || 'P'}
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                {terrain?.owner?.firstName} {terrain?.owner?.lastName}
              </p>
              <p className="text-xs text-gray-600">Propriétaire de {terrain?.name}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Sujet */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sujet
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Objet du message"
                required
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                rows="6"
                placeholder="Écrivez votre message ici..."
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.message.length}/2000 caractères
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
              disabled={sending}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={sending || !formData.message.trim()}
              className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {sending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Envoi...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Envoyer le message
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessageModal;

