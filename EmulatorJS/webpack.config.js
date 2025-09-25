const path = require('path');

module.exports = {
  entry: './src/emulator/index.js',
  output: {
    filename: 'emulatorjs.bundle.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'EmulatorJS',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js']
  },
  devtool: 'source-map',
  mode: 'development'
};