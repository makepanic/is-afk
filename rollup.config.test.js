import typescriptPlugin from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import typescript from 'typescript';
import commonjs from 'rollup-plugin-commonjs';
import multiEntry from "rollup-plugin-multi-entry";

export default {
  input: 'tests/**/*.ts',

  output: {
    name: 'isAfk',
    file: 'dist/test-afk.js',
    format: 'iife'
  },

  watch: {
    chokidar: false,
    include: [
      'lib/**',
      'tests/**/*.test.ts',
    ],
  },

  plugins: [
    typescriptPlugin({typescript}),
    resolve(),
    commonjs(),
    multiEntry(),
  ]
}
