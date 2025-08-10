// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  ...storybook.configs["flat/recommended"],
  {
    rules: {
      // Allow unused variables and imports
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-require-imports': 'warn',
      // Allow unescaped entities in JSX for better readability
      'react/no-unescaped-entities': 'warn',
      // Allow img elements (we'll optimize later)
      '@next/next/no-img-element': 'warn',
      // Allow storybook renderer packages for now
      'storybook/no-renderer-packages': 'warn',
      // Allow missing dependencies in useEffect
      'react-hooks/exhaustive-deps': 'warn',
    }
  },
  // Allow CommonJS in script files
  {
    files: ['scripts/**/*.js', '*.config.js', 'tests/**/*.ts'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off'
    }
  }
];

export default eslintConfig;
