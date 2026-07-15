/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Arka plan tonları: kırık beyaz / uçuk bej
        cream: {
          DEFAULT: "#FBF8F3",
          50: "#FEFDFB",
          100: "#FBF8F3",
          200: "#F5EFE4",
          300: "#EFE6D5",
        },
        // Vurgu 1: adaçayı yeşili
        sage: {
          50: "#F4F7F2",
          100: "#E6EDE1",
          200: "#CFDCC5",
          300: "#B3C9A4",
          400: "#93B27E",
          500: "#7A9C63",
          600: "#5F7D4C",
          700: "#4A613B",
        },
        // Vurgu 2: toz pembe
        dusty: {
          50: "#FBF3F2",
          100: "#F6E4E1",
          200: "#EEC9C3",
          300: "#E3A9A0",
          400: "#D5877B",
          500: "#C2685A",
          600: "#A14F43",
          700: "#7C3D34",
        },
        // Vurgu 3: soft toprak / terra
        clay: {
          50: "#FAF5F0",
          100: "#F1E4D6",
          200: "#E2C7A9",
          300: "#D1A87A",
          400: "#BE8B54",
          500: "#A5713D",
          600: "#835830",
        },
      },
      fontFamily: {
        sans: [
          "'Plus Jakarta Sans'",
          "'Inter'",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        soft: "0 2px 12px -2px rgba(122, 105, 90, 0.08)",
        "soft-md": "0 4px 20px -4px rgba(122, 105, 90, 0.12)",
        "soft-lg": "0 8px 30px -6px rgba(122, 105, 90, 0.15)",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.4s ease-out",
      },
    },
  },
  plugins: [],
}
