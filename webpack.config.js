module.exports = {
  entry: './samples/index.js',
  output: {
    filename: './build/ricohapi-mstorage.js',
    library: "RicohAPIMStorage",
    libraryTarget: "umd"
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/,
      query: {
        presets: ['es2015'],
        compact: false,
        cacheDirectory: true
      }
    }]
  },
  node: {
    fs: "empty"
  },
  resolve: {
    extensions: ['', '.js'],
    modulesDirectories: ['node_modules'],
    module: {
      noParse: [ /\.\/dada\//, /\.\/nightwatch\// ],
    },
  }
};
