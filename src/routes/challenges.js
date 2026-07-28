const express = require('express');
const { MODE } = require('../config');
const { getChallenges } = require('../db/challenges');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    mode: MODE,
    challenges: getChallenges(MODE),
  });
});

module.exports = router;
