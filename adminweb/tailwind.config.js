/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        admin: {
          sidebar: "#111827", // Dark Slate/Gray
          content: "#F9FAFB", // Light Gray
        },
      },
    },
  },
  plugins: [],
}
