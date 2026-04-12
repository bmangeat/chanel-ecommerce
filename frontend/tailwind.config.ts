import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        sans: ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        chanel: {
          black: '#1a1a1a',
          white: '#fafafa',
          gold: '#c9a96e',
          gray: {
            light: '#f5f5f5',
            DEFAULT: '#9e9e9e',
            dark: '#424242',
          },
        },
      },
      letterSpacing: {
        luxury: '0.2em',
        widest: '0.25em',
      },
    },
  },
  plugins: [],
}

export default config
