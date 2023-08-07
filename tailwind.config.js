/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontFamily: {
      serif: ['Merriweather', 'serif'],
      sans: ['Open Sans', 'sans-serif'],
      mono: ['Menlo', 'monospace'],
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        primary: "#EFA12B",
        primaryDark: "#DB8605",
        secondary: "#F3B454",
        tertiary: "#ED68EF",
        quaternary: colors.indigo,
        success: colors.emerald,
        error: colors.red,
        info: colors.sky,
        warning: colors.orange,
        fontp: colors.zinc,
      },
      width: {
        '95vw': '95vw',
        '95%': '95%',
        '85%': '85%',
      },
      height: {
        '95vh': '95vh',
        '90vh': '90vh',
        '85vh': '85vh',
        '80vh': '80vh',
      },
      keyframes: {
        blink: {
          '0%, 50%, 100%': {
            opacity: '0',
          },
          '25%, 75%': {
            opacity: '1',
          },
        },
      },
      animation: {
        // the transition should happen instantly without fading effect
        blink: 'blink 1.5s infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class', // only generate classes, no global styles
    }),
  ],
}

