/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      gridTemplateColumns: {
        21: "repeat(21, minmax(0, 1fr))",
        25: "repeat(25, minmax(0, 1fr))",
        29: "repeat(29, minmax(0, 1fr))",
        33: "repeat(33, minmax(0, 1fr))",
        57: "repeat(57, minmax(0, 1fr))",
      },
    },
  },
  plugins: [],
};
