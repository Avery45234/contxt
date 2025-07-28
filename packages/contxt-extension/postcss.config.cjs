module.exports = {
  plugins: [
    require('@tailwindcss/postcss')({
      // Provide an explicit path to the config file
      tailwindConfig: './tailwind.config.js',
    }),
    require('autoprefixer'),
  ],
};