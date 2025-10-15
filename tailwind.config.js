/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        foreground: '#ffffff',
        card: '#151515',
        'card-foreground': '#ffffff',
        popover: '#151515',
        'popover-foreground': '#ffffff',
        primary: '#ff2e97',
        'primary-foreground': '#ffffff',
        secondary: '#39ff14',
        'secondary-foreground': '#0a0a0a',
        muted: '#1a1a1a',
        'muted-foreground': '#888888',
        accent: '#ff2e97',
        'accent-foreground': '#ffffff',
        destructive: '#d4183d',
        'destructive-foreground': '#ffffff',
        border: 'rgba(255, 255, 255, 0.1)',
        input: 'transparent',
        'input-background': '#1a1a1a',
        'switch-background': '#2a2a2a',
        ring: '#ff2e97',
        neon: '#ff2e97',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #ff2e97' },
          '100%': { boxShadow: '0 0 20px #ff2e97, 0 0 30px #ff2e97' },
        },
      },
    },
  },
  plugins: [],
}
