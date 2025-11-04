/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#E8E4DC',
        richBlack: '#1A1A1A',
        deepSlate: '#2F4F4F',
        brightCyan: '#00CED1',
        warmAmber: '#FFB347',
      },
    },
  },
  plugins: [],
}
