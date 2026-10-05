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
          border: '#e2e8f0',
          borderHighlight: '#cbd5e1',
          grid: '#e2e8f0',
          cyan: '#0284c7', // Deep electric blue/cyan for high contrast in light mode
          cyanDim: 'rgba(2, 132, 199, 0.12)',
          cyanGlow: 'rgba(2, 132, 199, 0.3)',
          green: '#059669', // Emerald green
          greenDim: 'rgba(5, 150, 105, 0.12)',
          amber: '#d97706', // Amber warning
          amberDim: 'rgba(217, 119, 6, 0.12)',
          red: '#dc2626', // High contrast red
          redDim: 'rgba(220, 38, 38, 0.12)',
          purple: '#7c3aed', // Purple analysis
          purpleDim: 'rgba(124, 58, 237, 0.12)',
          blue: '#2563eb',
          textMuted: '#64748b',
          textSubtle: '#475569',
          textBright: '#0f172a',
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'instrument': '0 4px 12px -2px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
        'cyan-glow': '0 0 12px rgba(2, 132, 199, 0.25)',
      }
    },
  },
  plugins: [],
}
