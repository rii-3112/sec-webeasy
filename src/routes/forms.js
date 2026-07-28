const express = require('express');
const { MODE } = require('../config');
const { listForms, findForm, createForm } = require('../db/store');

const router = express.Router();

router.get('/', (req, res) => {
  const forms = listForms().map((f) => {
    const base = {
      publicId: f.publicId,
      title: f.title,
      questions: f.questions.map((q) => ({
        id: q.id,
        label: q.label,
        required: q.required,
        type: q.type,
      })),
    };

    if (MODE === 'medium') {
      return {
        ...base,
        _internal: { form_id: f.id },
      };
    }

    return {
      ...base,
      id: f.id,
    };
  });

  res.json(forms);
});

router.get('/:id', (req, res) => {
  const form = findForm(req.params.id);
  if (!form) {
    return res.status(404).json({ error: 'Form not found' });
  }

  res.json({
    id: form.id,
    publicId: form.publicId,
    title: form.title,
    questions: form.questions,
  });
});

router.post('/', (req, res) => {
  const { title, questions } = req.body;

  if (!title || !Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ error: 'title and questions are required' });
  }

  const form = createForm({ title, questions });
  res.status(201).json({
    id: form.id,
    publicId: form.publicId,
    title: form.title,
    questions: form.questions,
  });
});

module.exports = router;
