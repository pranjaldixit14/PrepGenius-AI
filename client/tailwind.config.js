/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Deep obsidian black-purple palette
        dark: {
          950: '#07050d', // Canvas base (obsidian)
          900: '#0d0819', // Card surface
          850: '#130c25', // Elevated surface
          800: '#1f1338', // Card borders & dividers
          750: '#2a1b4e', // Highlight borders
          700: '#382367', // Hover borders
          600: '#52348f',
        },
        obsidian: {
          base: '#07050d',
          card: '#0e091b',
          elevated: '#140c26',
          border: '#241544',
          borderHighlight: '#3c2373',
        },
        brand: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#8b5cf6', // Electric violet
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        magenta: {
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          neon: '#d946ef',
        },
        cyan: {
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'card': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
        'card-hover': '0 14px 38px -6px rgba(139, 92, 246, 0.25)',
        'glow-purple': '0 0 25px -3px rgba(139, 92, 246, 0.35)',
        'glow-magenta': '0 0 25px -3px rgba(217, 70, 239, 0.35)',
        'glow-cyan': '0 0 25px -3px rgba(6, 182, 212, 0.35)',
      }
    },
  },
  plugins: [],
}
