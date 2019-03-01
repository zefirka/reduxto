import babel from 'rollup-plugin-babel'
import {uglify} from 'rollup-plugin-uglify'

export default [
  {
    input: 'index.js',
    output: {
      file: 'dist/reducto.js',
      format: 'umd',
      name: 'reducto'
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
      file: 'dist/reducto.min.js',
      format: 'umd',
      name: 'reducto'
    },
    plugins: [
      uglify(),
      babel({
        exclude: 'node_modules/**'
      })
    ]
  },
]
