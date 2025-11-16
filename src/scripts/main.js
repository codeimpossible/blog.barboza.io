import '../styles/tailwind.css';
import { handleCodeCopying } from './copy.js';

if (DEV_MODE) console.log('Dev mode is currently enabled.');

const updateTheme = () => {
  const isDark =
    localStorage.theme === 'dark' ||
    (!('theme' in localStorage) &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
};

const lightMode = () => {
  localStorage.theme = 'light';
};

const darkMode = () => {
  localStorage.theme = 'dark';
};

const resetTheme = () => {
  localStorage.removeItem('theme');
};

const toggleTheme = () => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  console.log(prefersDark, localStorage.theme);
  if (!localStorage.theme) {
    (prefersDark ? lightMode : darkMode)();
    updateTheme();
    return;
  }
  if ('theme' in localStorage && localStorage.theme === 'dark') {
    lightMode();
  } else {
    darkMode();
  }
  updateTheme();
};

updateTheme();
handleCodeCopying();
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('theme-toggle');
  toggle.addEventListener('click', () => {
    toggleTheme();
  });
});
