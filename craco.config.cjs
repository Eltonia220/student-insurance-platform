const webpack = require('webpack');
const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // 1. Polyfill configurations
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer/'),
        util: require.resolve('util/'),
        process: require.resolve('process/browser.js')
      };

      // 2. Remove duplicate PUBLIC_URL definitions
      webpackConfig.plugins = webpackConfig.plugins.filter(
        plugin => !(plugin?.definitions?.['process.env.PUBLIC_URL'])
      );

      // 3. Add essential plugins
      webpackConfig.plugins.push(
        new webpack.ProvidePlugin({
          process: 'process/browser.js',
          Buffer: ['buffer', 'Buffer'],
        }),
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify(env),
          'process.env.PUBLIC_URL': JSON.stringify(process.env.PUBLIC_URL || paths.publicUrlOrPath)
        })
      );

      // 4. Fix for ESM modules
      webpackConfig.module.rules.push({
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false
        }
      });

      return webpackConfig;
    }
  },
  style: {
    sass: {
      loaderOptions: {
        implementation: require('sass'),
        sassOptions: {
          quietDeps: true,
          includePaths: [
            path.join(__dirname, 'node_modules'),
            path.join(__dirname, 'src/styles')
          ],
          fiber: false
        },
        // Only include variables here - other @use statements should be in component files
        additionalData: '@use "src/styles/variables" as *;'
      }
    },
    modules: {
      localIdentName: "[name]__[local]--[hash:base64:5]"
    }
  },
  jest: {
    configure: {
      moduleNameMapper: {
        '^crypto$': 'crypto-browserify',
        '^stream$': 'stream-browserify',
        '^\.module\.(css|scss)$': 'identity-obj-proxy'
      },
      transform: {
        '^.+\\.module\\.(css|scss)$': 'jest-css-modules-transform'
      },
      setupFilesAfterEnv: ['<rootDir>/src/setupTests.js']
    }
  },
  devServer: {
    hot: true,
    allowedHosts: "all",
    client: {
      overlay: {
        warnings: false,
        errors: true
      }
    },
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }
      return middlewares;
    }
  }
};