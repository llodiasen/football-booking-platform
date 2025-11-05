const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const terrainRoutes = require('./routes/terrains');
const reservationRoutes = require('./routes/reservations');
const paymentRoutes = require('./routes/payments');
const teamRoutes = require('./routes/teams');
const paytechRoutes = require('./routes/paytech');

const app = express();

// Connect to database
connectDB();

// Security middleware
app.use(helmet());

// Rate limiting - Plus permissif en développement
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // 1000 en dev, 100 en prod
  message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.'
});
app.use('/api/', limiter);

// CORS - Autoriser toutes les URLs Vercel + localhost
const corsOptions = {
  origin: function (origin, callback) {
    // Liste des origins autorisées
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      process.env.FRONTEND_URL
    ];
    
    // Autoriser toutes les URLs vercel.app
    if (!origin || 
        allowedOrigins.includes(origin) || 
        origin.includes('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));

// Compression
app.use(compression());

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Routes
const notificationRoutes = require('./routes/notifications');
app.use('/api/auth', authRoutes);
app.use('/api/terrains', terrainRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/paytech', paytechRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'API Plateforme de Réservation de Terrains de Football - Sénégal',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      terrains: '/api/terrains',
      reservations: '/api/reservations',
      payments: '/api/payments',
      teams: '/api/teams'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Erreur:', err.stack);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Erreur de validation',
      errors
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      success: false,
      message: `Ce ${field} est déjà utilisé`
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token invalide'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expiré'
    });
  }

  // Default error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erreur serveur interne',
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      error: err 
    })
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 Serveur démarré avec succès!                        ║
║                                                           ║
║   📍 Port: ${PORT}                                          ║
║   🌍 Environnement: ${process.env.NODE_ENV || 'development'}                      ║
║   🔗 API: http://localhost:${PORT}                         ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Erreur non gérée:', err);
  console.log('🔄 Arrêt du serveur...');
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM reçu. Arrêt du serveur...');
  server.close(() => {
    console.log('✅ Serveur arrêté');
    process.exit(0);
  });
});

module.exports = app;

