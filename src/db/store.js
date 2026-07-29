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

function findForm(idOrPublicId) {
  return store.forms.find(
    (f) => f.id === idOrPublicId || f.publicId === idOrPublicId
  );
}

function listForms() {
  return store.forms;
}

function createForm({ title, questions }) {
  const id = newFormId();
  const form = {
    id,
    publicId: MODE === 'easy' ? id : `form-${id.slice(0, 8)}`,
    title,
    isSecret: false,
    questions: questions || [],
  };
  store.forms.push(form);
  return form;
}

function listResponses(formId) {
  return store.responses.filter((r) => r.formId === formId);
}

function addResponse(response) {
  store.responses.push(response);
  return response;
}

module.exports = {
  store,
  findForm,
  listForms,
  createForm,
  listResponses,
  addResponse,
};
