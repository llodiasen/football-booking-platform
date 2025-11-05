import axios from 'axios';

// URL du backend - Production Vercel
const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === 'production' 
    ? 'https://football-booking-backend.vercel.app/api' 
    : 'http://localhost:5000/api');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour ajouter le token à toutes les requêtes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Intercepteur pour gérer les erreurs globalement
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token invalide ou expiré
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data)
};

// Terrains API
export const terrainAPI = {
  getAll: (params) => api.get('/terrains', { params }),
  getOne: (id) => api.get(`/terrains/${id}`),
  getOwnerTerrains: () => api.get('/terrains/my-terrains'),
  create: (data) => api.post('/terrains', data),
  update: (id, data) => api.put(`/terrains/${id}`, data),
  delete: (id) => api.delete(`/terrains/${id}`),
  getAvailability: (id, date) => api.get(`/terrains/${id}/availability`, { params: { date } }),
  getAvailabilityRange: (id, startDate, endDate) => api.get(`/terrains/${id}/availability`, { params: { startDate, endDate } }),
  addReview: (id, data) => api.post(`/terrains/${id}/reviews`, data),
  blockTimeSlot: (id, data) => api.post(`/terrains/${id}/block-slot`, data),
  unblockTimeSlot: (id, data) => api.post(`/terrains/${id}/unblock-slot`, data)
};

// Reservations API
export const reservationAPI = {
  getAll: () => api.get('/reservations'),
  getOne: (id) => api.get(`/reservations/${id}`),
  create: (data) => api.post('/reservations', data),
  update: (id, data) => api.put(`/reservations/${id}`, data),
  cancel: (id, reason) => api.put(`/reservations/${id}/cancel`, { cancellationReason: reason }),
  confirm: (id) => api.put(`/reservations/${id}/confirm`),
  revealContact: (id) => api.post(`/reservations/${id}/reveal-contact`)
};

// Payments API
export const paymentAPI = {
  getAll: () => api.get('/payments'),
  initiate: (data) => api.post('/payments/initiate', data),
  verify: (id) => api.get(`/payments/verify/${id}`)
};

// Teams API
export const teamAPI = {
  getAll: (params) => api.get('/teams', { params }),
  getOne: (id) => api.get(`/teams/${id}`),
  create: (data) => api.post('/teams', data),
  update: (id, data) => api.put(`/teams/${id}`, data),
  delete: (id) => api.delete(`/teams/${id}`),
  addMember: (id, userId, position) => api.post(`/teams/${id}/members`, { userId, position }),
  removeMember: (id, userId) => api.delete(`/teams/${id}/members/${userId}`),
  subscribe: (id, terrainId, plan) => api.post(`/teams/${id}/subscribe`, { terrainId, plan })
};

// PayTech API
export const paytechAPI = {
  initiatePayment: (reservationId) => api.post('/paytech/initiate', { reservationId }),
  checkPaymentStatus: (token) => api.get(`/paytech/status/${token}`)
};

export default api;

