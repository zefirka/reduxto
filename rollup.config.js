import babel from 'rollup-plugin-babel'
import {uglify} from 'rollup-plugin-uglify'

export default [
  {
    input: './src/index.js',
    output: {
      file: 'dist/reduxto.js',
      format: 'umd',
      name: 'reduxto'
    },
    plugins: [
      babel({
        exclude: 'node_modules/**'
      })
    ]
  },
  {
    input: './src/index.js',
    output: {
      file: 'dist/reduxto.min.js',
      format: 'umd',
      name: 'reduxto'
    },
    plugins: [
      uglify(),
      babel({
        exclude: 'node_modules/**'
      })
    ]
  },
]
