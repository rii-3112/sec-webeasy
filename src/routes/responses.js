const express = require('express');
const { randomUUID } = require('crypto');
const { MODE } = require('../config');
const {
  findForm,
  listResponses,
  addResponse,
} = require('../db/store');

const router = express.Router();

function sanitizeMedium(input) {
  return String(input)
    .replace(/<script>/gi, '')
    .replace(/<\/script>/gi, '');
}

function processAnswers(answers) {
  if (MODE === 'medium') {
    return Object.fromEntries(
      Object.entries(answers || {}).map(([k, v]) => [k, sanitizeMedium(v)])
    );
  }
  return answers || {};
}

router.get('/', (req, res) => {
  const formId = req.query.form_id;

  if (!formId) {
    return res.status(400).json({ error: 'form_id is required' });
  }

  const responses = listResponses(formId, req.sessionId).map((r) => ({
    id: r.id,
    formId: r.formId,
    answers: r.answers,
    submittedAt: r.submittedAt,
    ...(r.stamp ? { stamp: r.stamp } : {}),
  }));

  res.json(responses);
});

router.post('/', (req, res) => {
  const { formId, answers } = req.body;

  if (!formId) {
    return res.status(400).json({ error: 'formId is required' });
  }

  const form = findForm(formId);
  if (!form) {
    return res.status(404).json({ error: 'Form not found' });
  }

  const resolvedFormId = form.id;
  const processedAnswers = processAnswers(answers);

  if (MODE === 'medium') {
    for (const q of form.questions) {
      if (q.required) {
        const val = processedAnswers[q.id];
        if (val === undefined || val === null || String(val).trim() === '') {
          return res.status(400).json({ error: `Required field missing: ${q.label}` });
        }
      }
    }
  }

  addResponse({
    id: randomUUID(),
    formId: resolvedFormId,
    sessionId: req.sessionId,
    answers: processedAnswers,
    submittedAt: new Date().toISOString(),
  });

  res.json({
    ok: true,
    message: '投稿を受け付けました',
  });
});

module.exports = router;
