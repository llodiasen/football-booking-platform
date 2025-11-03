/**
 * Utilitaire pour calculer le prix d'une réservation
 * selon les règles de tarification avancées
 */

/**
 * Obtient le jour de la semaine en anglais
 * @param {Date} date 
 * @returns {string} 'monday', 'tuesday', etc.
 */
const getDayName = (date) => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[date.getDay()];
};

/**
 * Vérifie si une heure est dans un créneau
 * @param {string} time - Format "HH:mm"
 * @param {string} startTime - Format "HH:mm"
 * @param {string} endTime - Format "HH:mm"
 * @returns {boolean}
 */
const isTimeInSlot = (time, startTime, endTime) => {
  const timeMinutes = timeToMinutes(time);
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);

  // Gérer le cas où le créneau traverse minuit (ex: 22:00 - 02:00)
  if (endMinutes < startMinutes) {
    return timeMinutes >= startMinutes || timeMinutes <= endMinutes;
  }

  return timeMinutes >= startMinutes && timeMinutes <= endMinutes;
};

/**
 * Convertit une heure "HH:mm" en minutes depuis minuit
 * @param {string} time - Format "HH:mm"
 * @returns {number}
 */
const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Calcule le prix pour une réservation
 * @param {Object} terrain - Objet terrain avec pricing
 * @param {Date} date - Date de la réservation
 * @param {string} startTime - Heure de début "HH:mm"
 * @param {string} endTime - Heure de fin "HH:mm"
 * @returns {Object} { totalPrice, pricePerHour, breakdown, appliedRules }
 */
const calculatePrice = (terrain, date, startTime, endTime) => {
  // Durée en heures
  const durationHours = (timeToMinutes(endTime) - timeToMinutes(startTime)) / 60;

  // Si pas de tarification avancée, utiliser prix de base
  if (!terrain.pricing || !terrain.pricing.useAdvancedPricing) {
    const totalPrice = terrain.pricePerHour * durationHours;
    return {
      totalPrice,
      pricePerHour: terrain.pricePerHour,
      durationHours,
      breakdown: [{
        period: `${startTime} - ${endTime}`,
        hours: durationHours,
        pricePerHour: terrain.pricePerHour,
        subtotal: totalPrice
      }],
      appliedRules: ['Prix standard']
    };
  }

  const dayName = getDayName(date);
  const isWeekend = dayName === 'saturday' || dayName === 'sunday';
  const appliedRules = [];
  const breakdown = [];

  // 1. Chercher un créneau horaire spécifique pour ce jour/heure
  let applicableSlot = null;
  if (terrain.pricing.timeSlots && terrain.pricing.timeSlots.length > 0) {
    applicableSlot = terrain.pricing.timeSlots.find(slot => 
      slot.active &&
      slot.days.includes(dayName) &&
      isTimeInSlot(startTime, slot.startTime, slot.endTime)
    );
  }

  let pricePerHour;

  if (applicableSlot) {
    // Créneau horaire spécifique trouvé
    pricePerHour = applicableSlot.price;
    appliedRules.push(`Créneau "${applicableSlot.name}" (${applicableSlot.startTime}-${applicableSlot.endTime})`);
  } else if (isWeekend && terrain.pricing.weekendPrice) {
    // Prix weekend
    pricePerHour = terrain.pricing.weekendPrice;
    appliedRules.push('Tarif weekend');
  } else if (!isWeekend && terrain.pricing.weekdayPrice) {
    // Prix semaine
    pricePerHour = terrain.pricing.weekdayPrice;
    appliedRules.push('Tarif semaine');
  } else {
    // Prix par défaut
    pricePerHour = terrain.pricePerHour;
    appliedRules.push('Prix standard');
  }

  const totalPrice = pricePerHour * durationHours;

  breakdown.push({
    period: `${startTime} - ${endTime}`,
    day: dayName,
    hours: durationHours,
    pricePerHour,
    subtotal: totalPrice
  });

  return {
    totalPrice: Math.round(totalPrice),
    pricePerHour,
    durationHours,
    breakdown,
    appliedRules
  };
};

/**
 * Obtient tous les prix applicables pour un terrain un jour donné
 * @param {Object} terrain 
 * @param {Date} date 
 * @returns {Array} Liste des prix selon les créneaux
 */
const getPricesForDay = (terrain, date) => {
  const dayName = getDayName(date);
  const isWeekend = dayName === 'saturday' || dayName === 'sunday';
  const prices = [];

  // Prix de base
  let basePrice = terrain.pricePerHour;
  let basePriceLabel = 'Prix standard';

  // Prix semaine/weekend
  if (terrain.pricing && terrain.pricing.useAdvancedPricing) {
    if (isWeekend && terrain.pricing.weekendPrice) {
      basePrice = terrain.pricing.weekendPrice;
      basePriceLabel = 'Tarif weekend';
    } else if (!isWeekend && terrain.pricing.weekdayPrice) {
      basePrice = terrain.pricing.weekdayPrice;
      basePriceLabel = 'Tarif semaine';
    }
  }

  prices.push({
    label: basePriceLabel,
    price: basePrice,
    timeSlot: 'Toute la journée',
    isDefault: true
  });

  // Créneaux horaires spécifiques
  if (terrain.pricing && terrain.pricing.timeSlots) {
    terrain.pricing.timeSlots
      .filter(slot => slot.active && slot.days.includes(dayName))
      .forEach(slot => {
        prices.push({
          label: slot.name,
          price: slot.price,
          timeSlot: `${slot.startTime} - ${slot.endTime}`,
          isDefault: false
        });
      });
  }

  return prices;
};

/**
 * Applique les réductions sur un prix
 * @param {number} basePrice - Prix de base
 * @param {Array} discounts - Réductions du terrain
 * @param {Object} bookingDetails - Détails réservation { date, startTime, endTime, duration, promoCode, isFirstBooking }
 * @returns {Object} { finalPrice, discountAmount, appliedDiscounts }
 */
const applyDiscounts = (basePrice, discounts, bookingDetails) => {
  if (!discounts || discounts.length === 0) {
    return {
      finalPrice: basePrice,
      discountAmount: 0,
      appliedDiscounts: []
    };
  }

  const now = new Date();
  const dayName = getDayName(bookingDetails.date);
  let totalDiscount = 0;
  const appliedDiscounts = [];

  // Filtrer les réductions actives et valides
  const validDiscounts = discounts.filter(d => {
    if (!d.active) return false;
    if (d.validFrom && new Date(d.validFrom) > now) return false;
    if (d.validUntil && new Date(d.validUntil) < now) return false;
    if (d.conditions?.maxUses && d.conditions.usedCount >= d.conditions.maxUses) return false;
    return true;
  });

  validDiscounts.forEach(discount => {
    let applicable = false;
    
    switch (discount.type) {
      case 'duration':
        // Réduction si durée >= minDuration
        if (bookingDetails.duration >= (discount.conditions?.minDuration || 0)) {
          applicable = true;
        }
        break;

      case 'promo_code':
        // Réduction si code promo fourni
        if (bookingDetails.promoCode === discount.conditions?.promoCode) {
          applicable = true;
        }
        break;

      case 'time_slot':
        // Réduction si dans créneau horaire
        const slot = discount.conditions?.timeSlot;
        if (slot && slot.days.includes(dayName) && 
            isTimeInSlot(bookingDetails.startTime, slot.startTime, slot.endTime)) {
          applicable = true;
        }
        break;

      case 'first_booking':
        // Réduction première réservation
        if (bookingDetails.isFirstBooking) {
          applicable = true;
        }
        break;
    }

    if (applicable) {
      const discountValue = discount.valueType === 'percentage'
        ? (basePrice * discount.value) / 100
        : discount.value;

      totalDiscount += discountValue;
      appliedDiscounts.push({
        name: discount.name,
        value: discount.value,
        valueType: discount.valueType,
        amount: discountValue
      });
    }
  });

  // Le total des réductions ne peut pas dépasser le prix de base
  totalDiscount = Math.min(totalDiscount, basePrice);

  return {
    finalPrice: Math.round(basePrice - totalDiscount),
    discountAmount: Math.round(totalDiscount),
    appliedDiscounts
  };
};

/**
 * Calcule le prix complet avec réductions
 * @param {Object} terrain 
 * @param {Date} date 
 * @param {string} startTime 
 * @param {string} endTime 
 * @param {Object} options - { promoCode, isFirstBooking }
 * @returns {Object}
 */
const calculatePriceWithDiscounts = (terrain, date, startTime, endTime, options = {}) => {
  // 1. Calculer le prix de base
  const priceInfo = calculatePrice(terrain, date, startTime, endTime);

  // 2. Appliquer les réductions
  const discountInfo = applyDiscounts(
    priceInfo.totalPrice,
    terrain.discounts,
    {
      date,
      startTime,
      endTime,
      duration: priceInfo.durationHours,
      promoCode: options.promoCode,
      isFirstBooking: options.isFirstBooking || false
    }
  );

  return {
    ...priceInfo,
    ...discountInfo,
    originalPrice: priceInfo.totalPrice
  };
};

/**
 * Formatte un prix en FCFA
 * @param {number} price 
 * @returns {string}
 */
const formatPrice = (price) => {
  return `${price.toLocaleString('fr-FR')} FCFA`;
};

module.exports = {
  calculatePrice,
  calculatePriceWithDiscounts,
  applyDiscounts,
  getPricesForDay,
  getDayName,
  isTimeInSlot,
  timeToMinutes,
  formatPrice
};

