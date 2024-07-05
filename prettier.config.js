/** @type {import("prettier").Config} */

const config = {
  trailingComma: 'none',
  printWidth: 80,
  semi: true,
  singleQuote: true,
  plugins: ['prettier-plugin-tailwindcss']
};

module.exports = config;
