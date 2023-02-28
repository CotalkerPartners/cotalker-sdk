module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'airbnb-typescript/base',
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parserOptions: {
    project: 'cotalker-sdk/tsconfig.eslint.json',
  },
  'plugins': [
    '@typescript-eslint',
    'simple-import-sort',
    'import',
  ],
  rules: {
    'no-underscore-dangle': 'off',
    'import/prefer-default-export': 'off',
    'no-await-in-loop': 'off',
    'max-len': [
      'error',
      140,
      2,
      {
        'ignoreUrls': true,
        'ignoreComments': false,
        'ignoreRegExpLiterals': true,
        'ignoreStrings': true,
        'ignoreTemplateLiterals': true,
      },
    ],
    'no-param-reassign': ['error', { 'props': false }],
    'no-restricted-syntax': [
      'error',
      {
        'selector': 'ForInStatement',
        'message': 'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
      },
      {
        'selector': 'LabeledStatement',
        'message': 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
      },
      {
        'selector': 'WithStatement',
        'message': '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
      },
    ],

    'sort-imports': 'off',
    'import/order': 'off', // overwrite for simple-import-sort
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'indent': ['error', 2, { 'SwitchCase': 1, 'ignoredNodes': ['PropertyDefinition'] }],
    'no-promise-executor-return': ['off'],
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single'],
    'eol-last': ['error', 'always'],
    'constructor-super': ['error'],
    'curly': ['error', 'multi-line'],
    'dot-notation': ['error'],
    'no-duplicate-imports': ['error'],
    'no-multiple-empty-lines': ['error'],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-inferrable-types': ['error', {
      'ignoreParameters': true,
    },
    ],
    '@typescript-eslint/no-misused-new': ['error'],
    '@typescript-eslint/semi': ['error', 'never'],
    'import/extensions': ['error', 'ignorePackages', {
      'js': 'never',
      'ts': 'never',
      'tsx': 'never',
    },
    ],
  },
}
