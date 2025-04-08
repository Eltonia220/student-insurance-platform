import postcssPresetEnv from 'postcss-preset-env';
import cssnano from 'cssnano';

const isProduction = process.env.NODE_ENV === 'production';

export default {
  plugins: [
    postcssPresetEnv({
      stage: 3,
      features: {
        'nesting-rules': true,
        'custom-media-queries': true,
        'color-mod-function': true,
        'logical-properties-and-values': true,
        'media-query-ranges': true
      },
      autoprefixer: {
        flexbox: 'no-2009',
        grid: 'autoplace',
        overrideBrowserslist: [
          '> 0.5%',
          'last 2 versions',
          'Firefox ESR',
          'not dead',
          'not IE 11'
        ]
      },
      preserve: false
    }),
    isProduction && cssnano({
      preset: ['default', {
        discardComments: {
          removeAll: true
        },
        cssDeclarationSorter: {
          order: 'concentric-css'
        },
        normalizeWhitespace: true
      }]
    })
  ].filter(Boolean)
};