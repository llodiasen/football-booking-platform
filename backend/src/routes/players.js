const express = require('express');
const router = express.Router();
const { getAllPlayers, getPlayer } = require('../controllers/playerController');

// Routes publiques
router.get('/', getAllPlayers);
router.get('/:id', getPlayer);

module.exports = router;

