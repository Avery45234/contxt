module.exports = {
  plugins: [
    require('@tailwindcss/postcss')({
      tailwindConfig: './tailwind.config.js', // optional, if not default
    }),
    require('autoprefixer'),
  ],
}
