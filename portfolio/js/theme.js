(function () {
  const STORAGE_KEY = 'portfolio-theme';
  const LIGHT = 'light';

  function applyTheme(theme) {
    document.body.classList.toggle('theme-light', theme === LIGHT);
  }

  function getInitialTheme() {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === LIGHT) return LIGHT;
    return 'dark';
  }

  function updateToggleUi(button) {
    const isLight = document.body.classList.contains('theme-light');
    const icon = button.querySelector('i');
    const label = button.querySelector('span');

    if (icon) icon.className = isLight ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
    if (label) label.textContent = isLight ? 'Dark mode' : 'Light mode';
    button.setAttribute('aria-pressed', String(isLight));
  }

  document.addEventListener('DOMContentLoaded', function () {
    const button = document.getElementById('theme-toggle');
    if (!button) return;

    applyTheme(getInitialTheme());
    updateToggleUi(button);

    button.addEventListener('click', function () {
      const isLight = document.body.classList.contains('theme-light');
      const nextTheme = isLight ? 'dark' : LIGHT;
      window.localStorage.setItem(STORAGE_KEY, nextTheme);
      applyTheme(nextTheme);
      updateToggleUi(button);
    });
  });
})();
