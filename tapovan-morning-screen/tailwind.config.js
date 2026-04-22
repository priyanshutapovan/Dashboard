/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"IBM Plex Serif"', 'Georgia', 'serif'],
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace']
      },
      colors: {
        paper: '#f6f2e8',
        ink: '#1a1a1a',
        muted: '#6b6b6b',
        rule: '#dcd6c5',
        accent: '#c2611a',
        accentSoft: '#e08a3d',
        alertBg: '#f8e5e5',
        alertText: '#a1241f',
        gain: '#6b8e23',
        link: '#2a5f8a'
      },
      letterSpacing: {
        widest2: '0.18em'
      }
    }
  },
  plugins: []
}
