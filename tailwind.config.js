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
          bg: '#080b11',
          panel: '#0f1520',
          panelHeader: '#141c2b',
          border: '#1e293b',
          borderHighlight: '#2d3e55',
          grid: '#131e2e',
          cyan: '#00f0ff',
          cyanDim: 'rgba(0, 240, 255, 0.12)',
          cyanGlow: 'rgba(0, 240, 255, 0.4)',
          green: '#10b981',
          greenDim: 'rgba(16, 185, 129, 0.12)',
          amber: '#f59e0b',
          amberDim: 'rgba(245, 158, 11, 0.12)',
          red: '#ef4444',
          redDim: 'rgba(239, 68, 68, 0.12)',
          purple: '#a855f7',
          purpleDim: 'rgba(168, 85, 247, 0.12)',
          blue: '#3b82f6',
          textMuted: '#64748b',
          textSubtle: '#94a3b8',
          textBright: '#f8fafc',
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'instrument': '0 4px 20px -2px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        'cyan-glow': '0 0 15px rgba(0, 240, 255, 0.3)',
      }
    },
  },
  plugins: [],
}
