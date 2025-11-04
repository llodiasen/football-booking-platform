import { Lock, Unlock, CheckCircle } from 'lucide-react';

const TimeSlot = ({ 
  startTime, 
  endTime, 
  status = 'available', // available, booked, blocked
  blockReason = '',
  blockNote = '',
  onBlock,
  onUnblock,
  className = ''
}) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'booked':
        return {
          container: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300 cursor-not-allowed',
          badge: 'bg-blue-600 text-white',
          badgeText: 'Réservé',
          icon: '👤',
          actionButton: null
        };
      case 'blocked':
        return {
          container: 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-300',
          badge: 'bg-orange-600 text-white',
          badgeText: blockReason || 'Bloqué',
          icon: '🔒',
          actionButton: (
            <button
              onClick={onUnblock}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all hover:shadow-md text-sm"
            >
              <Unlock size={16} />
              Débloquer
            </button>
          )
        };
      case 'available':
      default:
        return {
          container: 'bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-green-400 hover:shadow-md cursor-pointer',
          badge: 'bg-green-600 text-white',
          badgeText: 'Disponible',
          icon: '✅',
          actionButton: (
            <button
              onClick={onBlock}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white rounded-lg font-medium transition-all hover:shadow-md text-sm"
            >
              <Lock size={16} />
              Bloquer
            </button>
          )
        };
    }
  };

  const styles = getStatusStyles();

  return (
    <div className={`
      relative p-5 rounded-xl border-2 transition-all duration-300
      ${styles.container}
      ${className}
    `}>
      {/* Badge de statut en haut à droite */}
      <div className="absolute -top-2 -right-2 z-10">
        <span className={`
          inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold shadow-lg
          ${styles.badge}
        `}>
          <span>{styles.icon}</span>
          <span>{styles.badgeText}</span>
        </span>
      </div>

      {/* Heure principale */}
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 tracking-tight">
              {startTime}
            </p>
          </div>
          <div className="text-gray-400">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 10L13 10M13 10L10 7M13 10L10 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 tracking-tight">
              {endTime}
            </p>
          </div>
        </div>
        
        {/* Durée */}
        <p className="text-xs text-gray-500 mt-2 font-medium">
          {(() => {
            const [startH, startM] = startTime.split(':').map(Number);
            const [endH, endM] = endTime.split(':').map(Number);
            const duration = (endH * 60 + endM - startH * 60 - startM) / 60;
            return `${duration}h`;
          })()}
        </p>
      </div>

      {/* Note de blocage si présente */}
      {status === 'blocked' && blockNote && (
        <div className="mb-4 p-3 bg-white/80 rounded-lg border border-orange-200">
          <p className="text-xs text-orange-800 font-medium">
            📝 {blockNote}
          </p>
        </div>
      )}

      {/* Raison si réservé */}
      {status === 'booked' && (
        <div className="mb-4 p-3 bg-white/80 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-800 font-medium text-center">
            Ce créneau est déjà réservé par un client
          </p>
        </div>
      )}

      {/* Bouton d'action */}
      {styles.actionButton}
    </div>
  );
};

export default TimeSlot;

