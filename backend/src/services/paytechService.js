const axios = require('axios');

class PayTechService {
  constructor() {
    this.apiKey = process.env.PAYTECH_API_KEY || '89361ca99c7b8f94175abdc385aaa27679e52be0b6cd348e3ec8711ae7fd0da9';
    this.secretKey = process.env.PAYTECH_SECRET_KEY || '89361ca99c7b8f94175abdc385aaa27679e52be0b6cd348e3ec8711ae7fd0da9';
    this.apiUrl = process.env.PAYTECH_API_URL || 'https://paytech.sn/api/payment/request-payment';
    this.mode = process.env.PAYTECH_MODE || 'test';
    this.successUrl = process.env.PAYTECH_SUCCESS_URL || 'http://localhost:5173/payment/success';
    this.cancelUrl = process.env.PAYTECH_CANCEL_URL || 'http://localhost:5173/payment/cancel';
    this.ipnUrl = process.env.PAYTECH_IPN_URL || 'http://localhost:5000/api/payments/paytech/callback';
  }

  /**
   * Initier un paiement PayTech
   * @param {Object} paymentData - Données du paiement
   * @param {string} paymentData.item_name - Nom de l'article
   * @param {number} paymentData.item_price - Prix de l'article
   * @param {string} paymentData.command_name - Référence de la commande
   * @param {string} paymentData.ref_command - Référence unique de la commande
   * @param {string} paymentData.env - Environnement (test ou prod)
   * @param {string} paymentData.currency - Devise (XOF, EUR, USD)
   * @param {string} paymentData.custom_field - Données personnalisées (JSON stringifié)
   * @returns {Promise<Object>} - Résultat de l'initialisation
   */
  async initiatePayment(paymentData) {
    try {
      const payload = {
        item_name: paymentData.item_name,
        item_price: paymentData.item_price,
        command_name: paymentData.command_name,
        ref_command: paymentData.ref_command,
        env: this.mode,
        currency: paymentData.currency || 'XOF', // Franc CFA par défaut
        success_url: this.successUrl,
        cancel_url: this.cancelUrl,
        ipn_url: this.ipnUrl,
        custom_field: paymentData.custom_field || JSON.stringify({
          reservationId: paymentData.reservationId,
          clientId: paymentData.clientId,
          terrainId: paymentData.terrainId
        })
      };

      console.log('📤 PayTech - Envoi de la requête de paiement:', payload);

      const response = await axios.post(this.apiUrl, payload, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'API_KEY': this.apiKey,
          'API_SECRET': this.secretKey
        }
      });

      console.log('✅ PayTech - Réponse reçue:', response.data);

      if (response.data.success === 1 || response.data.success === '1') {
        return {
          success: true,
          token: response.data.token,
          redirect_url: response.data.redirect_url || `https://paytech.sn/payment/checkout/${response.data.token}`,
          ref_command: paymentData.ref_command,
          data: response.data
        };
      } else {
        throw new Error(response.data.message || 'Erreur lors de l\'initialisation du paiement');
      }
    } catch (error) {
      console.error('❌ PayTech - Erreur:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Erreur lors de l\'initialisation du paiement PayTech'
      );
    }
  }

  /**
   * Vérifier le statut d'un paiement
   * @param {string} token - Token PayTech
   * @returns {Promise<Object>} - Statut du paiement
   */
  async checkPaymentStatus(token) {
    try {
      const response = await axios.get(
        `https://paytech.sn/api/payment/check/${token}`,
        {
          headers: {
            'Accept': 'application/json',
            'API_KEY': this.apiKey,
            'API_SECRET': this.secretKey
          }
        }
      );

      console.log('✅ PayTech - Statut du paiement:', response.data);

      return {
        success: true,
        status: response.data.status, // 1 = success, 0 = pending, -1 = failed
        data: response.data
      };
    } catch (error) {
      console.error('❌ PayTech - Erreur vérification statut:', error.response?.data || error.message);
      throw new Error('Erreur lors de la vérification du statut du paiement');
    }
  }

  /**
   * Traiter le callback IPN (Instant Payment Notification)
   * @param {Object} ipnData - Données du callback
   * @returns {Object} - Résultat du traitement
   */
  processIPN(ipnData) {
    try {
      console.log('📥 PayTech - IPN reçu:', ipnData);

      // Vérifier la signature/hash si nécessaire
      // PayTech envoie généralement: type_event, ref_command, item_name, item_price, payment_method, payment_ref, custom_field

      const customField = ipnData.custom_field ? JSON.parse(ipnData.custom_field) : {};

      return {
        success: true,
        type_event: ipnData.type_event, // 'sale_complete' = succès
        ref_command: ipnData.ref_command,
        payment_method: ipnData.payment_method,
        payment_ref: ipnData.payment_ref,
        amount: ipnData.item_price,
        reservationId: customField.reservationId,
        clientId: customField.clientId,
        terrainId: customField.terrainId,
        rawData: ipnData
      };
    } catch (error) {
      console.error('❌ PayTech - Erreur traitement IPN:', error.message);
      throw new Error('Erreur lors du traitement du callback PayTech');
    }
  }
}

module.exports = new PayTechService();

