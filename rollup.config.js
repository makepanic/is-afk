import typescriptPlugin from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import typescript from 'typescript';
import commonjs from 'rollup-plugin-commonjs';

export default {
  entry: './index.ts',

  output: {
    file: 'dist/is-afk.js',
    format: 'iife'
  },

  watch: {
    include: [
      'lib/**',
    ],
  },

  plugins: [
    typescriptPlugin({typescript}),
    resolve(),
    commonjs(),
  ]
}
