const path = require('path');

module.exports = {
  entry: './src/scripts/admin-list.js',
  output: {
    path: path.resolve(__dirname, 'public/scripts'),
    filename: 'admin-list-bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  mode: 'development'
};