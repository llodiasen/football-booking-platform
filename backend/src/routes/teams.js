const express = require('express');
const router = express.Router();
const {
  getTeams,
  getTeam,
  createTeam,
  updateTeam,
  deleteTeam,
  addMember,
  removeMember,
  subscribe,
  invitePlayer
} = require('../controllers/teamController');
const { protect } = require('../middleware/auth');
const { validateTeam, handleValidationErrors } = require('../middleware/validation');

// Routes publiques
router.get('/', getTeams);
router.get('/:id', getTeam);

// Routes protégées
router.post('/', protect, validateTeam, handleValidationErrors, createTeam);
router.put('/:id', protect, updateTeam);
router.delete('/:id', protect, deleteTeam);
router.post('/:id/members', protect, addMember);
router.delete('/:id/members/:userId', protect, removeMember);
router.post('/:id/subscribe', protect, subscribe);
router.post('/invite-player', invitePlayer); // Route publique pour invitation

module.exports = router;

