module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended'
  ],
  env: {
    node: true,
    browser: true
  },
  ignorePatterns: [
    'tailwind.config.js',
    'postcss.config.js'
  ]
}