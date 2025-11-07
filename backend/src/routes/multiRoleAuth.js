const express = require('express');
const router = express.Router();
const {
  registerTeam,
  registerPlayer,
  registerSubscriber,
  loginMultiRole
} = require('../controllers/multiRoleAuthController');

// Routes d'inscription
router.post('/register/team', registerTeam);
router.post('/register/player', registerPlayer);
router.post('/register/subscriber', registerSubscriber);

// Route de connexion multi-rôles
router.post('/login/multi', loginMultiRole);

module.exports = router;

