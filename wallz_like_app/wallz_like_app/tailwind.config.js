/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gaming: {
          dark: "#090416",       // Deep dark space background
          darker: "#05020c",     // Ultra deep background
          tile: "#1f153a",       // Dark purple grid tile
          tileBorder: "#34225d", // Grid tile border
          blue: "#00a2ff",       // Vibrant bubble blue
          pink: "#e231a6",       // Vibrant bubble pink/magenta
          gold: "#fbbf24",       // Metallic capsule gold/yellow
          purple: "#581ca6",     // Thick board violet-purple
          purpleLight: "#8b5cf6" // Glowing purple
        }
      },
      boxShadow: {
        'glossy-blue': 'inset 0 4px 6px -1px rgba(255, 255, 255, 0.6), inset 0 -4px 6px -1px rgba(0, 0, 0, 0.4), 0 10px 15px -3px rgba(0, 162, 255, 0.3)',
        'glossy-pink': 'inset 0 4px 6px -1px rgba(255, 255, 255, 0.6), inset 0 -4px 6px -1px rgba(0, 0, 0, 0.4), 0 10px 15px -3px rgba(226, 49, 166, 0.3)',
        'glossy-gold': 'inset 0 3px 5px -1px rgba(255, 255, 255, 0.7), inset 0 -3px 5px -1px rgba(0, 0, 0, 0.4), 0 8px 12px -3px rgba(251, 191, 36, 0.25)',
        'glossy-purple': 'inset 0 4px 8px -1px rgba(255, 255, 255, 0.3), inset 0 -4px 8px -1px rgba(0, 0, 0, 0.5), 0 12px 20px -3px rgba(88, 28, 166, 0.4)',
        'tile-inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.6)',
      }
    },
  },
  plugins: [],
}
