const express = require('express');
const { randomUUID } = require('crypto');
const { MODE, STAMPS } = require('../config');
const { getClientIp } = require('../middleware/clientIp');
const {
  findForm,
  listResponses,
  addResponse,
  incrementSubmissionCount,
  hasIpSubmitted,
  recordIpSubmission,
  countResponsesForForm,
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

  const responses = listResponses(formId).map((r) => ({
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

    const ip = getClientIp(req);
    if (hasIpSubmitted(resolvedFormId, ip)) {
      return res.status(429).json({ error: 'Already submitted from this IP' });
    }

    const existingCount = countResponsesForForm(resolvedFormId);
    const hasXff = typeof req.headers['x-forwarded-for'] === 'string'
      && req.headers['x-forwarded-for'].trim();

    recordIpSubmission(resolvedFormId, ip);
    addResponse({
      id: randomUUID(),
      formId: resolvedFormId,
      answers: processedAnswers,
      submittedAt: new Date().toISOString(),
      ip,
    });

    const stamp = hasXff && existingCount >= 1 ? STAMPS.medium.bypass : undefined;

    return res.json({
      ok: true,
      message: '投稿を受け付けました',
      ...(stamp ? { stamp } : {}),
    });
  }

  const count = incrementSubmissionCount(resolvedFormId);
  addResponse({
    id: randomUUID(),
    formId: resolvedFormId,
    answers: processedAnswers,
    submittedAt: new Date().toISOString(),
  });

  const stamp = count >= 2 ? STAMPS.easy.bypass : undefined;

  res.json({
    ok: true,
    message: '投稿を受け付けました',
    ...(stamp ? { stamp } : {}),
  });
});

module.exports = router;
