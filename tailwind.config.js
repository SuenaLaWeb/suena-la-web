/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./content/**/*.md",
    "./layouts/**/*.html",
  ],
  darkMode: 'class', // ¡MUY IMPORTANTE! Esto activa la variante 'dark:'

  theme: {
    extend: {
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            // Estilos para el modo CLARO (texto oscuro por defecto del plugin)
            // Estos son los colores por defecto del plugin prose.
            // Si el body NO tiene la clase 'dark', se aplicarán estos.
            color: theme('colors.gray.700'),
            h1: { color: theme('colors.gray.900') },
            h2: { color: theme('colors.gray.900') },
            h3: { color: theme('colors.gray.800') },
            h4: { color: theme('colors.gray.800') },
            a: { color: theme('colors.blue.600') },
            strong: { color: theme('colors.gray.900') },
            em: { color: theme('colors.gray.600') },
            'ol > li::before': { color: theme('colors.gray.500') },
            'ul > li::before': { backgroundColor: theme('colors.gray.500') },
            code: { color: theme('colors.gray.900') },
            'code::before': { content: 'none' },
            'code::after': { content: 'none' },
            pre: { backgroundColor: theme('colors.gray.800'), color: theme('colors.gray.200') },
          },
        },
        // Estilos para el modo OSCURO (cuando el elemento CON LA CLASE 'prose'
        // TAMBIÉN tiene la clase 'dark' aplicada a un ancestro).
        // ¡Estos son los colores que quieres para tus noticias!
        invert: {
          css: {
            color: theme('colors.gray.300'), // Texto principal de párrafos (gris claro)
            h1: { color: theme('colors.white') }, // Títulos H1 en blanco
            h2: { color: theme('colors.gray.100') }, // Títulos H2 en gris muy claro
            h3: { color: theme('colors.gray.100') },
            h4: { color: theme('colors.gray.100') },
            a: { color: theme('colors.blue.400') },
            strong: { color: theme('colors.white') },
            em: { color: theme('colors.gray.400') },
            'ol > li::before': { color: theme('colors.gray.400') },
            'ul > li::before': { backgroundColor: theme('colors.gray.400') },
            code: { color: theme('colors.gray.100') },
            pre: { backgroundColor: theme('colors.gray.700'), color: theme('colors.gray.300') },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};