// Son de notification style WhatsApp
export const playNotificationSound = () => {
  try {
    // Essayer d'abord le son local si disponible
    const audio = new Audio('/sounds/whatsapp.mp3');
    audio.volume = 0.7;
    
    audio.play().catch(() => {
      // Si le fichier local n'existe pas, utiliser le son synthétique style WhatsApp
      playWhatsAppSound();
    });
    
  } catch (error) {
    playWhatsAppSound();
  }
};

// Son synthétique style WhatsApp (deux "ding" rapides)
const playWhatsAppSound = () => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    const createNote = (frequency, startTime, duration, volume = 0.5) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      // Enveloppe ADSR pour un son plus naturel
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.005);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };
    
    const now = audioContext.currentTime;
    
    // Son style WhatsApp: deux notes courtes et cristallines
    createNote(587.33, now, 0.12, 0.5);        // Note D5 (premier "ding")
    createNote(783.99, now + 0.08, 0.15, 0.4); // Note G5 (deuxième "ding" plus aigu)
    
  } catch (error) {
    console.error('Erreur son WhatsApp:', error);
  }
};


// Alternative: Utiliser un fichier audio si disponible
export const playNotificationSoundFromFile = (audioUrl) => {
  try {
    const audio = new Audio(audioUrl);
    audio.volume = 0.5;
    audio.play().catch(err => console.error('Erreur lecture audio:', err));
  } catch (error) {
    console.error('Erreur lors de la lecture du son:', error);
  }
};

