import js from '@eslint/js';

export default [
  {
    ignores: [
      '**/tests/lib/**',
      '1-exercise-solutions/**',
      '2-copy-of-code/lesson-1[3-7]/**',
      '2-copy-of-code/lesson-0*/**',
      '2-copy-of-code/scripts/**'
    ]
  },
  js.configs.recommended,
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        document: 'readonly',
        window: 'readonly',
        localStorage: 'readonly',
        fetch: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        XMLHttpRequest: 'readonly',
        URL: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeAll: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        spyOn: 'readonly',
        process: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': ['error', {argsIgnorePattern: '^_'}],
      'no-var': 'error',
      'prefer-const': 'error',
      eqeqeq: ['error', 'always'],
      semi: ['error', 'always'],
      quotes: ['error', 'single', {avoidEscape: true}]
    }
  }
];
