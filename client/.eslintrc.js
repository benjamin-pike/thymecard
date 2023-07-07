module.exports = {
    env: { browser: true, es2020: true },
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react-hooks/recommended'],
    parser: '@typescript-eslint/parser',
    parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    settings: { react: { version: '18.2' } },
    plugins: ['react-refresh'],
    rules: {
        'react-refresh/only-export-components': 'warn',
        'prettier/prettier': [
            'error',
            {},
            {
                usePrettierrc: true
            }
        ],
        '@typescript-eslint/no-explicit-any': 0,
        '@typescript-eslint/no-unused-vars': [
            'error',
            {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_',
                ignoreRestSiblings: true
            }
        ],
        'max-len': ['error', { code: 140, ignoreTrailingComments: true, ignoreStrings: true, ignoreTemplateLiterals: true }],
        'sort-imports': 2
    }
};
