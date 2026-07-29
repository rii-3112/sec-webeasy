const express = require('express');
const { MODE, STAMPS } = require('../config');
const { getChallenges } = require('../db/challenges');

const router = express.Router();

router.get('/', (req, res) => {
  const stamps = STAMPS[MODE];
  res.json({
    mode: MODE,
    challenges: getChallenges(MODE).map((c) => ({
      ...c,
      stamp: stamps[c.id],
    })),
  });
});

module.exports = router;
