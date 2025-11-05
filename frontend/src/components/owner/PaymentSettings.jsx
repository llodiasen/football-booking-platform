import { useState, useEffect } from 'react';
import { Upload, CheckCircle, X, Eye, EyeOff } from 'lucide-react';
import { authAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const PaymentSettings = ({ user, onUpdate }) => {
  const { success: showSuccess, error: showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    waveNumber: '',
    orangeMoneyNumber: '',
    freeMoneyNumber: '',
    waveQRCode: '',
    orangeMoneyQRCode: '',
    freeMoneyQRCode: ''
  });

  const [previewImages, setPreviewImages] = useState({
    wave: null,
    orangeMoney: null,
    freeMoney: null
  });

  useEffect(() => {
    if (user?.ownerProfile?.paymentInfo) {
      const paymentInfo = user.ownerProfile.paymentInfo;
      setFormData({
        waveNumber: paymentInfo.waveNumber || '',
        orangeMoneyNumber: paymentInfo.orangeMoneyNumber || '',
        freeMoneyNumber: paymentInfo.freeMoneyNumber || '',
        waveQRCode: paymentInfo.waveQRCode || '',
        orangeMoneyQRCode: paymentInfo.orangeMoneyQRCode || '',
        freeMoneyQRCode: paymentInfo.freeMoneyQRCode || ''
      });

      setPreviewImages({
        wave: paymentInfo.waveQRCode || null,
        orangeMoney: paymentInfo.orangeMoneyQRCode || null,
        freeMoney: paymentInfo.freeMoneyQRCode || null
      });
    }
  }, [user]);

  const handleImageUpload = (service, event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Vérifier la taille (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      showError('L\'image ne doit pas dépasser 2 MB');
      return;
    }

    // Vérifier le type
    if (!file.type.startsWith('image/')) {
      showError('Veuillez sélectionner une image');
      return;
    }

    // Convertir en base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      
      setPreviewImages({
        ...previewImages,
        [service]: base64String
      });

      setFormData({
        ...formData,
        [`${service === 'wave' ? 'wave' : service === 'orangeMoney' ? 'orangeMoney' : 'freeMoney'}QRCode`]: base64String
      });
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (service) => {
    setPreviewImages({
      ...previewImages,
      [service]: null
    });

    setFormData({
      ...formData,
      [`${service === 'wave' ? 'wave' : service === 'orangeMoney' ? 'orangeMoney' : 'freeMoney'}QRCode`]: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mettre à jour le profil avec les infos de paiement
      await authAPI.updateProfile({
        ownerProfile: {
          ...user.ownerProfile,
          paymentInfo: formData
        }
      });

      showSuccess('Informations de paiement mises à jour avec succès !');
      
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      showError(error.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Informations de paiement
          </h2>
          <p className="text-gray-600">
            Configurez vos numéros et QR codes pour recevoir les paiements de vos clients
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Wave */}
          <div className="border-2 border-[#00D9E1] border-opacity-20 rounded-2xl p-6 bg-gradient-to-br from-[#00D9E1]/5 to-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#00D9E1] to-[#00B4BC] rounded-xl flex items-center justify-center">
                <span className="text-white font-black text-xl">W</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Wave</h3>
                <p className="text-sm text-gray-600">Mobile Money</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Numéro Wave */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Numéro Wave
                </label>
                <input
                  type="tel"
                  value={formData.waveNumber}
                  onChange={(e) => setFormData({ ...formData, waveNumber: e.target.value })}
                  placeholder="77 123 45 67"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00D9E1] focus:border-transparent"
                />
              </div>

              {/* QR Code Wave */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  QR Code Wave (optionnel)
                </label>
                
                {previewImages.wave ? (
                  <div className="relative">
                    <img 
                      src={previewImages.wave} 
                      alt="QR Wave" 
                      className="w-32 h-32 border-2 border-[#00D9E1] rounded-xl object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage('wave')}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-[#00D9E1] rounded-xl cursor-pointer hover:bg-[#00D9E1]/5 transition-colors">
                    <Upload className="text-[#00D9E1] mb-2" size={24} />
                    <span className="text-xs text-gray-600">Upload QR</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload('wave', e)}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Orange Money */}
          <div className="border-2 border-[#FF6600] border-opacity-20 rounded-2xl p-6 bg-gradient-to-br from-[#FF6600]/5 to-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF6600] to-[#FF8533] rounded-xl flex items-center justify-center">
                <span className="text-white font-black text-xl">OM</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Orange Money</h3>
                <p className="text-sm text-gray-600">Mobile Money</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Numéro Orange Money
                </label>
                <input
                  type="tel"
                  value={formData.orangeMoneyNumber}
                  onChange={(e) => setFormData({ ...formData, orangeMoneyNumber: e.target.value })}
                  placeholder="77 123 45 67"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6600] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  QR Code Orange Money (optionnel)
                </label>
                
                {previewImages.orangeMoney ? (
                  <div className="relative">
                    <img 
                      src={previewImages.orangeMoney} 
                      alt="QR Orange Money" 
                      className="w-32 h-32 border-2 border-[#FF6600] rounded-xl object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage('orangeMoney')}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-[#FF6600] rounded-xl cursor-pointer hover:bg-[#FF6600]/5 transition-colors">
                    <Upload className="text-[#FF6600] mb-2" size={24} />
                    <span className="text-xs text-gray-600">Upload QR</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload('orangeMoney', e)}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Free Money */}
          <div className="border-2 border-[#E3000F] border-opacity-20 rounded-2xl p-6 bg-gradient-to-br from-[#E3000F]/5 to-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#E3000F] to-[#FF1A2B] rounded-xl flex items-center justify-center">
                <span className="text-white font-black text-xl">FM</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Free Money</h3>
                <p className="text-sm text-gray-600">Mobile Money</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Numéro Free Money
                </label>
                <input
                  type="tel"
                  value={formData.freeMoneyNumber}
                  onChange={(e) => setFormData({ ...formData, freeMoneyNumber: e.target.value })}
                  placeholder="77 123 45 67"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E3000F] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  QR Code Free Money (optionnel)
                </label>
                
                {previewImages.freeMoney ? (
                  <div className="relative">
                    <img 
                      src={previewImages.freeMoney} 
                      alt="QR Free Money" 
                      className="w-32 h-32 border-2 border-[#E3000F] rounded-xl object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage('freeMoney')}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-[#E3000F] rounded-xl cursor-pointer hover:bg-[#E3000F]/5 transition-colors">
                    <Upload className="text-[#E3000F] mb-2" size={24} />
                    <span className="text-xs text-gray-600">Upload QR</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload('freeMoney', e)}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-800">
              💡 <strong>Comment obtenir votre QR code ?</strong>
            </p>
            <ul className="text-sm text-blue-700 mt-2 space-y-1 ml-4">
              <li>• <strong>Wave :</strong> Ouvrez l'app → Menu → Mon QR code → Screenshot</li>
              <li>• <strong>Orange Money :</strong> Ouvrez l'app → QR Code → Screenshot</li>
              <li>• <strong>Free Money :</strong> Ouvrez l'app → Mon QR → Screenshot</li>
            </ul>
            <p className="text-xs text-blue-600 mt-3">
              ⚠️ Si vous n'uploadez pas de QR code, vos clients verront seulement votre numéro de téléphone
            </p>
          </div>

          {/* Boutons */}
          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-semibold rounded-xl transition-colors disabled:cursor-not-allowed"
              style={{ backgroundColor: !loading ? '#15803d' : undefined }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Enregistrement...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CheckCircle size={20} />
                  Enregistrer les modifications
                </span>
              )}
            </button>

            <p className="text-sm text-gray-500">
              Ces informations seront visibles uniquement par vos clients lors du paiement
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentSettings;

