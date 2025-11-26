import '../styles/tailwind.css';
import { handleCodeCopying } from './copy.js';
import { replaceImg } from './random-me.js';

if (DEV_MODE) console.log('Dev mode is currently enabled.');

const updateTheme = () => {
  const isDark =
    localStorage.theme === 'dark' ||
    (!('theme' in localStorage) &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
};

const lightMode = () => {
  if (DEV_MODE) console.log(`setting theme to: light`);
  localStorage.theme = 'light';
};

const darkMode = () => {
  if (DEV_MODE) console.log(`setting theme to: dark`);
  localStorage.theme = 'dark';
};

const resetTheme = () => {
  if (DEV_MODE) console.log(`clearing set theme.`);
  localStorage.removeItem('theme');
};

const toggleTheme = () => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
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
  replaceImg();
  const toggle = document.getElementById('theme-toggle');
  toggle.addEventListener('click', () => {
    toggleTheme();
  });
});
