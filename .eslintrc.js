module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'standard'
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: [
    'vue'
  ],
  rules: {
    'no-tabs': 'off',
    'vue/multi-word-component-names': 'off',
    'space-infix-ops': 'error',
    'no-return-assign': 'off',
    'no-unused-vars': 'off',
    'space-before-function-paren': ['error', 'never'],
    'vue/comment-directive': 'off',
    eqeqeq: ['off'],
    indent: ['off', 2],
    semi: ['error', 'always'],
    camelcase: 'off'
  },
  globals: {
    uni: true,
    wx: true,
    App: true,
    getApp: true,
    Page: true,
    getCurrentPages: true,
    Component: true,
    Behavior: true
  }
};
