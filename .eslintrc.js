module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
  },
  globals: {
    'enchant': true,
    'CHEST': true,
    'POT': true,
    'CAVE': true,
    'mapData1': true,
    'mapData2': true,
    'foregroundData': true,
    'collisionData': true
  }
}
