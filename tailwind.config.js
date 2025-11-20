module.exports = {
  purge: {
    content: [
      './src/**/*.js',
      './src/**/*.svg',
      './src/**/*.md',
    ],
  },
  content: ['./src/**/*.{html,md,njk}'],
  plugins: [require('@tailwindcss/custom-forms')],
  theme: {
    extend: {
      fontFamily: {
        inter: '"Inter", sans-serif;',
      },
    },
  },
  future: {
    removeDeprecatedGapUtilities: true,
  },
};
