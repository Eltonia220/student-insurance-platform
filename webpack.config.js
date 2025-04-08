import path from 'path';
import { fileURLToPath } from 'url';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';

// Proper ES module replacement for __dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDevelopment = process.env.NODE_ENV === 'development';

export default {
  mode: isDevelopment ? 'development' : 'production',
  entry: './src/index.js', // Entry point for your application
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    assetModuleFilename: 'assets/[contenthash][ext][query]', // File hashing for better caching
  },
  devtool: isDevelopment ? 'eval-source-map' : 'source-map', // Enable source maps in development

  devServer: {
    static: {
      directory: path.join(__dirname, 'public'), // Serve static files from the public folder
    },
    compress: true, // Enable gzip compression
    port: 3000, // Local development server port
    hot: true, // Enable Hot Module Replacement
    historyApiFallback: true, // Allow SPA routing
    client: {
      overlay: {
        errors: true, // Show only errors in overlay
        warnings: false,
      },
    },
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // Transpile JavaScript and JSX files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                targets: '> 0.25%, not dead',
                useBuiltIns: 'usage',
                corejs: 3,
              }],
              ['@babel/preset-react', {
                runtime: 'automatic',
                development: isDevelopment, // React is in development mode if true
              }],
            ],
            plugins: [
              isDevelopment && 'react-refresh/babel', // Apply react-refresh plugin in development
            ].filter(Boolean), // Only apply plugins in development
          },
        },
      },
      {
        test: /\.(sa|sc|c)ss$/, // Handle CSS, SCSS, and SASS files
        use: [
          isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                auto: true,
                localIdentName: isDevelopment
                  ? '[path][name]__[local]--[hash:base64:5]'
                  : '[hash:base64:8]',
              },
              importLoaders: 2, // Process CSS imports before SCSS
            },
          },
          'postcss-loader', // Process CSS (e.g., autoprefixing)
          'sass-loader', // Compile SCSS to CSS
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp|avif)$/i, // Handle image files
        type: 'asset/resource',
        generator: {
          filename: 'images/[contenthash][ext][query]',
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/i, // Handle font files
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[contenthash][ext][query]',
        },
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin(), // Clean up the dist folder
    new HtmlWebpackPlugin({
      template: './public/index.html', // Use a custom HTML template
      favicon: './public/favicon.ico',
      meta: {
        viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
      },
    }),
    isDevelopment && new ReactRefreshWebpackPlugin(), // React refresh only in development
    !isDevelopment && new MiniCssExtractPlugin({ // Extract CSS in production
      filename: 'css/[name].[contenthash].css',
      chunkFilename: 'css/[id].[contenthash].css',
    }),
    new webpack.DefinePlugin({ // Define environment variables for your app
      'process.env.REACT_APP_API_URL': JSON.stringify(process.env.REACT_APP_API_URL || 'http://localhost:3001'),
    }),
  ].filter(Boolean), // Filter out falsy plugins

  resolve: {
    extensions: ['.js', '.jsx'], // Resolve JavaScript and JSX extensions
    alias: {
      react: path.resolve(__dirname, './node_modules/react'), // Ensure only one React instance is used
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
      '@': path.resolve(__dirname, 'src/'), // Create alias for the src folder
    },
  },

  optimization: {
    splitChunks: {
      chunks: 'all', // Enable code splitting for optimization
    },
  },
};
