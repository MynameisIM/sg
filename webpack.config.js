const SvgStorePlugin = require('external-svg-sprite-loader');
const webpack = require('webpack');
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MediaQueryPlugin = require('./plugins/media-query-plugin/src/index');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const StyleLintPlugin = require('stylelint-webpack-plugin');

let pages = glob.sync(__dirname + '/source/pages/*.pug');
const plugins = [
  new StyleLintPlugin(),
  new CleanWebpackPlugin(['dist']),
  new MiniCssExtractPlugin({
    filename: "./assets/styles/[name].css",
    chunkFilename: "./assets/styles/[name].css",
  }),
  new CopyWebpackPlugin([
    {
      from: './source/static',
      to: './',
      ignore: ['*.md']
    }
  ]),
  new SvgStorePlugin({
    sprite: {
      startX: 10,
      startY: 10,
      deltaX: 20,
      deltaY: 20,
      iconHeight: 20,
    },
    prefix: 'usage',
    suffix: ''
  })
];
pages.map(function (file) {
  let base = path.basename(file, '.pug');
  plugins.push(new HtmlWebpackPlugin({
    filename: './' + base + '.html',
    chunks: [base, 'vendor', 'common'],
    template: './source/pages/' + base + '.pug',
    inject: false
  }));
});

module.exports = (env, argv) => {
  const dirEntry = './source/entity/';
  if (env && env.develop === 'true') {
    plugins.push(new webpack.DefinePlugin({
      IS_DEV: true,
    }));
  } else {
    plugins.push(new webpack.DefinePlugin({
      IS_DEV: false,
    }));
    new MediaQueryPlugin({
      include: true,
      queries: {
        '(max-width: 767px)': 'mobile',
        '(min-width: 1024px)': 'desktop',
        '(min-width: 1280px)': 'desktop',
        '(min-width: 1440px)': 'desktop',
      }
    })
  }
  return {
    entry: fs.readdirSync(dirEntry).reduce((summ, item) => {
      summ[item] = `${dirEntry}${item}/${item}.js`;
      return summ;
    }, {}),
    output: {
      filename: './assets/scripts/[name].bundle.js',
      chunkFilename: './assets/scripts/chunk/[id]-[hash].chunk.js',
      path: path.resolve(__dirname, 'dist')
    },
    plugins,
    module: {
      rules: [
        {
          test: /\.json$/,
          use: [
            {
              loader: path.resolve('./loaders/split-json-loader.js'),
              options: {
                dir: path.resolve('./source/data')
              }
            }
          ]
        },
        {
          enforce: "pre",
          test: /\.js$/,
          exclude: /node_modules/,
          loader: "eslint-loader",
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: './../../',
              }
            },
            "css-loader",
            MediaQueryPlugin.loader,
            {
              loader: 'postcss-loader',
              options: {
                plugins: function () {
                  return [
                    require('autoprefixer')({browsers: "last 5 versions"}),
                    require("css-mqpacker")({
                      sort: true
                    })
                  ];
                }
              }
            },
            {
              loader: "sass-loader",
              options: {
                includePaths: [
                  path.resolve(__dirname,'source/base/styles')
                ]
              }
            },
            {
              loader: 'sass-resources-loader',
              options: {
                includePath: path.resolve(__dirname, 'source'),
                resources: './source/base/styles/_common.scss',
              }
            },
          ]
        },
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: [
            "cache-loader",
            {
              loader: 'babel-loader',
              options: {
                "presets": ["@babel/preset-env"],
                "plugins": ["@babel/plugin-syntax-dynamic-import"]
              }
            }]
        },
        {
          loader: SvgStorePlugin.loader,
          test: /\.svg$/,
          exclude: [path.resolve(__dirname, 'source/assets/images')],
          options: {
            iconName: '[name]-usage',
            name: './assets/sprite.svg',
          },
        },
        {
          test: /\.(png|jpg|webp|svg?)(\?.+)?$/,
          exclude: [path.resolve(__dirname, 'source/assets/svg')],
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'assets/images/[name].[ext]',
              }
            }
          ]
        },
        {
          test: /\.(ttf|eot|woff|woff2)$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "assets/fonts/[name].[ext]",
              },
            }
          ],
        },
        {
          enforce: 'pre',
          test: /\.pug$/,
          exclude: /node_modules/,
          loader: 'pug-lint-loader',
          options: require('./.pug-lintrc.js'),
        },
        {
          test: /\.pug$/,
          use: [
            {
              loader: "pug-loader",
              options: { pretty: true }
            }
          ]
        }
      ]
    },
    resolve: {
      extensions: [".js", ".json", ".sass", ".pug"],
      alias: {
        "TweenMax": 'gsap/src/uncompressed/TweenMax',
        "TimelineMax": 'gsap/src/uncompressed/TimelineMax',
        "TweenLite": 'gsap/src/uncompressed/TweenLite',
        "TimelineLite": 'gsap/src/uncompressed/TimelineLite',
        "ScrollMagic": 'scrollmagic/scrollmagic/uncompressed/ScrollMagic',
        "animation.gsap": 'scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap',
        "debug.addIndicators": 'scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators',
        "@": path.resolve(__dirname,'./source'),
        static: path.resolve(__dirname,'./source/static'),
        assets: path.resolve(__dirname,'./source/assets'),
      },
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all',
          }
        }
      },
      minimizer: [
        new UglifyJSPlugin({
          sourceMap: true,
          uglifyOptions: {
            compress: {
              inline: false
            }
          }
        }),
        new OptimizeCSSAssetsPlugin({
          cssProcessor: require('cssnano'),
          cssProcessorOptions: {
            zindex: false,
            reduceIdents: false,
            discardUnused: false
          },
        }),
      ],
    },
    devServer: {
      host: '0.0.0.0',
      watchContentBase: true,
      port: 9001,
      open: true,
      disableHostCheck: true,
      noInfo: true,
      compress: true,
      hot: false,
      stats: 'minimal',
      publicPath: "/",
      before(app) {
        app.post('*', (req, res) => {
          res.send(req.originalUrl);
        });
      },
    }
  };
};
