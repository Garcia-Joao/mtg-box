const { heroui } = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/react/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        Blue: {
          extend: "dark",
          colors: {
            background: "#091E52",
            foreground: "#ffffff",
            primary: {
              50: "#82BBE6",
              100: "#AFDBF6",
              200: "#5E98CD",
              300: "#306BAC",
              400: "#183E7B",
              500: "#0F2B63",
              600: "#0F2B63",
              DEFAULT: "#306BAC",
              foreground: "#ffffff",
            },
            focus: "#AFDBF6",
          },
          layout: {
            disabledOpacity: "0.3",
            radius: {
              small: "4px",
              medium: "6px",
              large: "8px",
            },
            borderWidth: {
              small: "1px",
              medium: "2px",
              large: "3px",
            },
          },
        },
      },
    }),
  ],
};
