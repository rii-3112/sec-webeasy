const express = require('express');
const { MODE, STAMPS } = require('../config');

const router = express.Router();

router.post('/verify', (req, res) => {
  const { stamp } = req.body;

  if (!stamp || typeof stamp !== 'string') {
    return res.status(400).json({ error: 'stamp is required' });
  }

  const trimmed = stamp.trim();
  const stamps = STAMPS[MODE];
  const match = Object.entries(stamps).find(([, value]) => value === trimmed);

  if (!match) {
    return res.json({ correct: false });
  }

  res.json({
    correct: true,
    challengeId: match[0],
  });
});

module.exports = router;
