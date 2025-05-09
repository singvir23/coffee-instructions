/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
      './src/components/**/*.{js,ts,jsx,tsx,mdx}',
      './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        colors: {
          // Using your CSS variable names directly
          // Tailwind will understand rgb(var(--name)) format
          'foreground': 'rgb(var(--foreground-rgb))',
          'background-start': 'rgb(var(--background-start-rgb))',
          'background-end': 'rgb(var(--background-end-rgb))',
          'accent': 'rgb(var(--accent-color))', // For classes like text-accent, bg-accent
          'accent-light': 'rgb(var(--accent-light))',
          'neutral-light': 'rgb(var(--neutral-light))',
          'neutral-dark': 'rgb(var(--neutral-dark))',
  
          // Example: If you had hex values for amber in your component classes
          // You can keep them here or reference your CSS variables if preferred
          amber: {
            50: '#fffbeb',
            100: '#fef3c7', // Your border-amber-100
            300: '#fcd34d', // Your after:bg-amber-300
            600: '#d97706', // Your focus:ring-amber-600
            700: '#b45309', // Your hover:bg-amber-700
            800: '#92400e', // Your bg-amber-800
            900: '#78350f', // Your text-amber-900
          },
        },
        fontFamily: {
          // Ensure --font-playfair and --font-inter are defined in your :root
          // And the fonts themselves are imported (e.g., Google Fonts <link> in layout.tsx)
          playfair: ['var(--font-playfair)', 'serif'],
          inter: ['var(--font-inter)', 'sans-serif'],
        },
      },
    },
    plugins: [],
  };