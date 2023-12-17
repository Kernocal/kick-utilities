import stylistic from '@stylistic/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
    {
        ignores: ['build/**', 'node_modules/**'],
    },
    stylistic.configs.customize({
        indent: 4,
        quotes: 'single',
        semi: true,
        jsx: false
    }),
    {
        files: ['**/*.js', '**/*.ts'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module'
            }
        },
        rules: {
            '@stylistic/comma-dangle': 'off',
            '@stylistic/no-trailing-spaces': 'off',
            '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: false }],
            '@stylistic/member-delimiter-style': ['error', { 
                multilineDetection: 'brackets',
                multiline: {
                    delimiter: 'none',
                    requireLast: false
                },
                singleline: {
                    delimiter: 'semi',
                    requireLast: true
                }
            }]
        }
    }
];
