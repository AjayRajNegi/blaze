/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  // theme: {
  //   extend: {
  //     colors: {
  //       primary: "#7B2FBE",
  //       "primary-light": "#F3E8FF",
  //       accent: "#9B59B6",
  //       teal: "#2EC4B6",
  //       "teal-light": "#E6FBF9",
  //       dark: "#1A1A2E",
  //       surface: "#F8F9FA",
  //       "gray-mid": "#6C757D",
  //       "dark-b": "#ODODOD",
  //       "dark-card": "#1C1C1E",
  //       "dark-border": "#2C2C2E",
  //       "dark-text": "#F8F9FA",
  //       "dark-subtext": "#9BA1A6",
  //     },
  //   },
  // },
  plugins: [],
};
