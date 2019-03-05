import typescriptPlugin from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import typescript from 'typescript';
import commonjs from 'rollup-plugin-commonjs';
import tsconfig from './tsconfig.json';

tsconfig.compilerOptions.sourceMap = true;
tsconfig.compilerOptions.emitDeclarationOnly = false;
tsconfig.compilerOptions.declaration = false;

export default {
  entry: './index.ts',

  output: [{
    name: 'is-afk',
    file: 'dist/is-afk.umd.js',
    format: 'umd'
  }, {
    name: 'is-afk',
    file: 'dist/is-afk.cjs.js',
    format: 'cjs'
  }, {
    name: 'is-afk',
    file: 'dist/is-afk.es.js',
    format: 'es'
  },],

  watch: {
    include: [
      'lib/**',
    ],
  },

  plugins: [
    typescriptPlugin({
      typescript,
      ...tsconfig.compilerOptions,
    }),
    resolve(),
    commonjs(),
  ]
}
