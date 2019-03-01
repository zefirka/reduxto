import babel from 'rollup-plugin-babel'
import {uglify} from 'rollup-plugin-uglify'

export default [
  {
    input: 'index.js',
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
    input: 'index.js',
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
