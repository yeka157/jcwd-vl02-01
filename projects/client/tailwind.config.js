/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors : {
        hijauBtn : '#015D67',
        bgWhite : '#F0F5F6',
        borderHijau : '#1F6C75',
        bgHijau : '#87e4d6',
        muted : '#99BDC1',
        bgHover : '#EBECF0'
    },
    fontFamily: {
        poppins : ['Poppins','sans-serif']
      }
    }
  },
  plugins: [],
}