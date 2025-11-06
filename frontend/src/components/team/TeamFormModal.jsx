import { useState } from 'react';
import { X, Users, Upload, Plus } from 'lucide-react';
import { teamAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Button from '../ui/Button';

const TeamFormModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    size: '5v5',
    maxMembers: 10
  });
  const [loading, setLoading] = useState(false);
  const { success: showSuccess, error: showError } = useToast();

  const teamSizes = [
    { value: '5v5', label: 'Football 5 (5 vs 5)', players: 10 },
    { value: '7v7', label: 'Football 7 (7 vs 7)', players: 14 },
    { value: '11v11', label: 'Football 11 (11 vs 11)', players: 22 }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      showError('Veuillez saisir un nom d\'équipe');
      return;
    }

    setLoading(true);
    try {
      const response = await teamAPI.create({
        ...formData,
        captain: undefined // Le backend définira automatiquement l'utilisateur comme captain
      });
      
      showSuccess('Équipe créée avec succès !');
      onSuccess && onSuccess(response.data.data);
      onClose();
    } catch (error) {
      showError(error.response?.data?.message || 'Erreur lors de la création de l\'équipe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Users className="text-white" size={24} />
              </div>
              <div className="text-white">
                <h2 className="text-2xl font-bold">Créer une équipe</h2>
                <p className="text-sm text-green-100">Formez votre équipe de foot</p>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          <div className="space-y-5">
            {/* Nom de l'équipe */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom de l'équipe <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ex: Les Lions de Dakar"
                required
              />
            </div>

            {/* Type d'équipe */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type d'équipe <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {teamSizes.map((size) => (
                  <button
                    key={size.value}
                    type="button"
                    onClick={() => setFormData({ 
                      ...formData, 
                      size: size.value,
                      maxMembers: size.players
                    })}
                    className={`p-4 border-2 rounded-xl transition-all ${
                      formData.size === size.value
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Users className={`mx-auto mb-2 ${
                      formData.size === size.value ? 'text-green-600' : 'text-gray-400'
                    }`} size={24} />
                    <p className={`font-semibold text-sm ${
                      formData.size === size.value ? 'text-green-900' : 'text-gray-900'
                    }`}>
                      {size.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {size.players} joueurs max
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (optionnel)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                rows="4"
                placeholder="Décrivez votre équipe, votre style de jeu, etc."
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.description.length}/500 caractères
              </p>
            </div>

            {/* Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-900">
                💡 <strong>Conseil :</strong> Après la création, vous pourrez inviter des membres à rejoindre votre équipe et réserver des terrains ensemble.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || !formData.name.trim()}
              className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Création...
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Créer l'équipe
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamFormModal;

