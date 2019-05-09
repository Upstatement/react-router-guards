import babel from 'rollup-plugin-babel';
import external from 'rollup-plugin-peer-deps-external';
import filesize from 'rollup-plugin-filesize';
import resolve from 'rollup-plugin-node-resolve';

import pkg from './package.json';

const outputs = [
  {
    name: 'main',
    format: 'cjs',
  },
  {
    name: 'module',
    format: 'es',
  },
];

export default {
  input: 'src/index.js',
  output: outputs.map(({ name, format }) => ({
    file: pkg[name],
    format,
    name,
    sourcemap: true,
  })),
  plugins: [
    babel({
      exclude: /node_modules/,
    }),
    external(),
    filesize(),
    resolve(),
  ],
};