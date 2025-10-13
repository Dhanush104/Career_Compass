// tailwind.config.js
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Set EB Garamond as the default 'sans' font
        sans: ['"EB Garamond"', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
}