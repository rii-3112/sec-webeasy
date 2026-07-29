const LOCAL_RESPONSES_KEY = 'secpro_local_responses';

function getLocalResponses() {
  try {
    const parsed = JSON.parse(localStorage.getItem(LOCAL_RESPONSES_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveLocalResponse(response) {
  const list = getLocalResponses();
  list.push(response);
  localStorage.setItem(LOCAL_RESPONSES_KEY, JSON.stringify(list));
}

function getLocalResponsesForForm(formId) {
  return getLocalResponses().filter((r) => r.formId === formId);
}
