module.exports = {
    extends: [
        'next',
        'next/core-web-vitals',
        'eslint:recommended',
        'plugin:react/recommended',
        'prettier',
        'plugin:prettier/recommended',
    ],
    plugins: ['react'],
    parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
    },
    rules: {
        'react/prop-types': [0],
    },
};
