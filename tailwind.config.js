/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        instrument: {
          bg: '#0b0e14',
          panel: '#121720',
          panelHeader: '#171e2b',
          border: '#222c3d',
          borderHighlight: '#2d3b52',
          grid: '#1a2230',
          blue: '#0ea5e9',
          green: '#10b981',
          amber: '#f59e0b',
          red: '#ef4444',
          purple: '#8b5cf6',
          textMuted: '#64748b',
          textSubtle: '#94a3b8',
          textBright: '#f1f5f9',
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '3px',
        sm: '2px',
        md: '3px',
        lg: '4px',
      }
    },
  },
  plugins: [],
}
