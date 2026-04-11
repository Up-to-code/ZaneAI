/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "zayon-dark": "#000000",
        "zayon-soft-dark": "#0A0A0A",
        "zayon-red": "#FF3D00",
        "zayon-card": "#121212",
        "zayon-secondary": "#A3A3A3",
        "zayon-muted": "#737373",
      },
      borderColor: {
        divider: "rgba(255,255,255,0.06)",
      },
      fontFamily: {
        sans: ["Manrope_500Medium"],
        medium: ["Manrope_500Medium"],
        semibold: ["Manrope_600SemiBold"],
        bold: ["Manrope_700Bold"],
      },
      boxShadow: {
        calm: "0px 12px 40px rgba(0,0,0,0.22)",
      },
    },
  },
  plugins: [],
};
