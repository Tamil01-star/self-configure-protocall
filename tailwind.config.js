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
          bg: '#f8fafc',
          panel: '#ffffff',
          panelHeader: '#f1f5f9',
          border: '#cbd5e1',
          borderHighlight: '#94a3b8',
          grid: '#e2e8f0',
          blue: '#0284c7',
          green: '#16a34a',
          amber: '#d97706',
          red: '#dc2626',
          purple: '#7c3aed',
          textMuted: '#64748b',
          textSubtle: '#475569',
          textBright: '#0f172a',
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
