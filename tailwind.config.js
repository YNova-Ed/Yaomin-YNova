/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,css}', './docs/**/*.md'],
  theme: {
    extend: {
      colors: {
        ynova: {
          sky: '#0ea5e9',
          skyDark: '#0369a1',
          amber: '#fbbf24',
          amberDark: '#d97706',
          red: '#dc2626',
          green: '#16a34a',
          ink: '#121826',
          muted: '#667085',
          line: '#e4e7ec',
          paper: '#ffffff',
          wash: '#f6f8fb'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace']
      },
      boxShadow: {
        clay: '0 1px 0 rgba(255,255,255,0.9) inset, 0 18px 45px rgba(15,23,42,0.08)',
        panel: '0 1px 2px rgba(15,23,42,0.04), 0 10px 30px rgba(15,23,42,0.05)'
      }
    }
  },
  plugins: []
}

