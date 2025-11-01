// Configuration des APIs de paiement mobile money

const paymentConfig = {
  wave: {
    apiKey: process.env.WAVE_API_KEY,
    merchantId: process.env.WAVE_MERCHANT_ID,
    baseUrl: 'https://api.wave.com/v1',
  },
  orangeMoney: {
    apiKey: process.env.ORANGE_MONEY_API_KEY,
    merchantId: process.env.ORANGE_MONEY_MERCHANT_ID,
    baseUrl: 'https://api.orange.com/orange-money-webpay/v1',
  },
  freeMoney: {
    apiKey: process.env.FREE_MONEY_API_KEY,
    merchantId: process.env.FREE_MONEY_MERCHANT_ID,
    baseUrl: 'https://api.free.sn/v1',
  },
};

// Simuler un paiement pour le développement
const simulatePayment = async (method, amount, phoneNumber) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        transactionId: `${method.toUpperCase()}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        message: 'Paiement simulé avec succès',
      });
    }, 2000);
  });
};

// Fonctions helper pour chaque provider
const initiateWavePayment = async (amount, phoneNumber, reference) => {
  // TODO: Implémenter l'intégration réelle avec Wave API
  // Pour l'instant, on simule
  return simulatePayment('wave', amount, phoneNumber);
};

const initiateOrangeMoneyPayment = async (amount, phoneNumber, reference) => {
  // TODO: Implémenter l'intégration réelle avec Orange Money API
  return simulatePayment('orange_money', amount, phoneNumber);
};

const initiateFreeMoneyPayment = async (amount, phoneNumber, reference) => {
  // TODO: Implémenter l'intégration réelle avec Free Money API
  return simulatePayment('free_money', amount, phoneNumber);
};

module.exports = {
  paymentConfig,
  initiateWavePayment,
  initiateOrangeMoneyPayment,
  initiateFreeMoneyPayment,
  simulatePayment,
};

