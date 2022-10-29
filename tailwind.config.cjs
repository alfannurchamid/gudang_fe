const { space } = require('svelte/internal')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 200s linear infinite',
      },
      fontFamily: {
        'poppins': ['"Poppins"', 'sans-serif'],
        'rubik': ['"Rubik"', 'sans-serif'],
        'karla': ['"Karla"', 'sans-serif'],
        'roboto': ['"Roboto Condensed"', 'sans-serif']
      },
      fontWeight: {
        'sbold': 500,
        'extram': 550
      },
      fontSize: {
        'sm-lh1': ['0.875rem', '2.25rem'],
        'xxs': '.60rem'
      },
      padding: {
        '145': ['3.25rem', '3.25rem',],
        '355': ['13px']
      },
      width: {
        '12.5': '3.2rem',
        '22': '5.5rem',
        '50': '12.5rem',
        '101': '25rem'
      },
      height: {
        '12.5': '3.2rem',
        '22': '5.5rem',
        '50': '12.5rem',
        '100': '21rem'
      }

    },
  },
  plugins: [],
}
