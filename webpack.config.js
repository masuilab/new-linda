const path = require('path');
const env =
  process.env.NODE_ENV === 'production' ? process.env.NODE_ENV : 'development';

module.exports = {
  mode: env,
  entry: {
    tupleSpace: './src/pages/tupleSpace.tsx',
    home: './src/pages/home.tsx',
  },
  output: {
    path: path.resolve(__dirname, 'public/js'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.(mp4|png|jpg|gif)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
