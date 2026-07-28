const { randomUUID } = require('crypto');
const { MODE, STAMPS } = require('../config');

const MEDIUM_SECRET_ID = 'a1111111-1111-4111-8111-111111111111';
const MEDIUM_PUBLIC_ID = 'b2222222-2222-4222-8222-222222222222';

function createSeedData() {
  const stamps = STAMPS[MODE];

  const secretFormId = MODE === 'easy' ? '1' : MEDIUM_SECRET_ID;
  const publicFormId = MODE === 'easy' ? '2' : MEDIUM_PUBLIC_ID;

  const forms = [
    {
      id: secretFormId,
      publicId: MODE === 'easy' ? '1' : 'feedback-2026',
      title: '【内部】経営陣向け機密アンケート',
      isSecret: true,
      questions: [
        { id: 'q1', label: '機密事項', required: true, type: 'textarea' },
      ],
    },
    {
      id: publicFormId,
      publicId: MODE === 'easy' ? '2' : 'event-survey',
      title: 'イベント満足度アンケート',
      isSecret: false,
      questions: [
        { id: 'name', label: 'お名前', required: true, type: 'text' },
        { id: 'comment', label: '自由記述', required: false, type: 'textarea' },
      ],
    },
  ];

  const responses = [
    {
      id: 'r-secret-1',
      formId: secretFormId,
      answers: {
        q1: '来期M&A計画は3月発表予定（極秘）',
      },
      stamp: stamps.idor,
      submittedAt: new Date('2026-03-01T09:00:00.000Z').toISOString(),
    },
  ];

  return {
    forms,
    responses,
    secretFormId,
    publicFormId,
  };
}

function newFormId() {
  return MODE === 'easy' ? String(Date.now()) : randomUUID();
}

module.exports = { createSeedData, newFormId, MEDIUM_SECRET_ID, MEDIUM_PUBLIC_ID };
