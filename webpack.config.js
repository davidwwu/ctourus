const path = require('path');

module.exports = {
  entry: './src/scripts/admin-list.js',
  output: {
    path: path.resolve(__dirname, 'public/scripts'),
    filename: 'admin-list-bundle.js'
  },
  mode: 'development'
};