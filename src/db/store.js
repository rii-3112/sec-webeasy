const { createSeedData, newFormId } = require('./seed');
const { MODE } = require('../config');

const GLOBAL_KEY = '__secproStore';

function createStore() {
  const seed = createSeedData();
  return {
    forms: [...seed.forms],
    responses: [...seed.responses],
    secretFormId: seed.secretFormId,
    publicFormId: seed.publicFormId,
  };
}

// Serverless でも同一インスタンス内では状態を保持（Vercel 等）
if (!global[GLOBAL_KEY]) {
  global[GLOBAL_KEY] = createStore();
}

const store = global[GLOBAL_KEY];

function isSeedForm(form) {
  return form.id === store.secretFormId || form.id === store.publicFormId;
}

function findForm(idOrPublicId, sessionId = null) {
  const form = store.forms.find(
    (f) => f.id === idOrPublicId || f.publicId === idOrPublicId
  );
  if (!form) return null;
  if (!isSeedForm(form) && form.sessionId !== sessionId) {
    return null;
  }
  return form;
}

function listForms(sessionId = null) {
  return store.forms.filter(
    (f) => isSeedForm(f) || f.sessionId === sessionId
  );
}

function createForm({ title, questions, sessionId }) {
  const id = newFormId();
  const form = {
    id,
    publicId: MODE === 'easy' ? id : `form-${id.slice(0, 8)}`,
    title,
    isSecret: false,
    questions: questions || [],
    sessionId,
  };
  store.forms.push(form);
  return form;
}

function listResponses(formId, sessionId = null) {
  return store.responses.filter((r) => {
    if (r.formId !== formId) return false;
    if (r.isSeed) return true;
    return r.sessionId === sessionId;
  });
}

function addResponse(response) {
  store.responses.push(response);
  return response;
}

module.exports = {
  store,
  isSeedForm,
  findForm,
  listForms,
  createForm,
  listResponses,
  addResponse,
};
