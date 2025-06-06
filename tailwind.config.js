/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderWidth: {
        '3': '3px',
      },
      width: {
        '192': '48rem',
      },
      height: {
        '192': '48rem',
      },
      aspectRatio: {
        '1': '1',
      },
      blur: {
        '3xl': '64px',
      },
      dropShadow: {
        'lg': '0 0 8px rgba(255, 255, 255, 0.25)',
      }
    },
  },
  // plugins: [
  //   require('@tailwindcss/aspect-ratio'),
  // ],
}