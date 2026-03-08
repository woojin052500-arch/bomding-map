import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'green-fresh': '#2d7a3a',
        'spring-yellow': '#f9f3e3',
        'earth': '#8b6914',
      },
      fontFamily: {
        myeongjo: ['Nanum Myeongjo', 'serif'],
        pretendard: ['Pretendard', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
