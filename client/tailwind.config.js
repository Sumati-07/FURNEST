/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        meadow: '#EEF2EA',
        pine: '#2F4A3D',
        pineDark: '#213529',
        honey: '#E2A33B',
        bark: '#2A2420',
        sand: '#D8CFC0',
        rosewood: '#B4614A'
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body: ['Inter', 'sans-serif']
      },
      borderRadius: {
        card: '12px'
      }
    }
  },
  plugins: []
}
