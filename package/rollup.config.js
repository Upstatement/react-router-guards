import babel from 'rollup-plugin-babel';
import cleanup from 'rollup-plugin-cleanup';
import external from 'rollup-plugin-peer-deps-external';
import filesize from 'rollup-plugin-filesize';
import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';

import pkg from './package.json';

const outputs = [
  {
    name: 'main',
    format: 'cjs',
    esModule: false,
  },
  {
    name: 'module',
    format: 'esm',
    esModule: true,
  },
];

const isProd = process.env.PRODUCTION === 'true';
const prodPlugins = [cleanup(), terser()];

export default {
  input: 'src/index.ts',
  output: outputs.map(({ esModule, name, format }) => ({
    esModule,
    file: pkg[name],
    format,
    name,
  })),
  plugins: [
    ...(isProd ? prodPlugins : []),
    babel({
      exclude: /node_modules/,
    }),
    external(),
    filesize(),
    resolve(),
    typescript(),
  ],
};
