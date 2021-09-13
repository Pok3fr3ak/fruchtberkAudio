const copyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/index.ts',
  // Put your normal webpack config below here
  module: {
    rules: require('./webpack.rules'),
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json']
  },
  target: 'electron-main',
  plugins: [
    new copyWebpackPlugin({
        patterns: [
            {
              from: path.resolve(__dirname, 'src', 'assets'),
              to: path.resolve(__dirname, '.webpack/renderer', 'assets')
/*               from: 'src/assets',
              to: 'assets' */
            }
        ],

    })
]
};