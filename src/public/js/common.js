async function initLayout() {
  const badge = document.getElementById('mode-badge');
  const navMode = document.getElementById('nav-mode');

  try {
    const res = await fetch('/api/config');
    const config = await res.json();
    const label = config.mode === 'medium' ? 'MEDIUM' : 'EASY';
    const color = config.mode === 'medium' ? 'bg-orange-500' : 'bg-green-500';

    if (badge) {
      badge.textContent = label;
      badge.className = `px-3 py-1 rounded-full text-white text-xs font-bold ${color}`;
    }
    if (navMode) {
      navMode.textContent = `${label} (:${config.port})`;
    }
  } catch {
    if (badge) badge.textContent = '???';
  }
}

document.addEventListener('DOMContentLoaded', initLayout);
