module.exports = {
  extends: 'standard',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  env: {
    browser: true,
    commonjs: true,
    jquery: true,
    mocha: true,
    node: true,
    jest: true,
  },
  globals: {
    io: true,
    moment: true,
    Mustache: true,
    Promise: true,
  },
  rules: {
    'no-console': 1,
    'comma-dangle': 0,
    'space-before-function-paren': 0,
  },
};
