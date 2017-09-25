const path = require('path')
const webpack = require('webpack')
const uglify = require('uglifyjs-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname,'assets','js'),
    filename: 'bundle.min.js'
  },
  devtool: 'source-map',

  module: {
    rules: [
      {test: /\.js$/, exclude: '/node_modules', loader: 'babel-loader'}
    ]
  },

  plugins: [
    new uglify({
      sourceMap: true
    }),

    new webpack.DefinePlugin({
      'process.env' : {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ],

  target: "electron"
  
}
new webpack.IgnorePlugin(/regeneratior|nodent|js-beautify/,/ajv/)