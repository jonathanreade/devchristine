const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = {

    entry: ['./src/app.js', './src/sass/main.scss'],
    output: {
        filename: './js/scripts.js',
        path: path.resolve(__dirname)
    },
    module: {
        rules: [
            // perform js babelization on all .js files
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                }
            },
            {
              test: /\.(woff(2)?|ttf|eot|otf)$/,
              use: [
              	{
              		loader: 'file-loader',
              		options: {
              			outputPath: 'fonts',
              			name: '[name].[ext]',
              		},
              	},
              ],
            },
            // compile all .scss files to plain old css
            {
                test: /\.(sass|scss)$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            }
        ]
    },
    plugins: [
        // extract css into dedicated file
        new MiniCssExtractPlugin({
            filename: './style.css'
        }),

        new BrowserSyncPlugin({
            host: 'localhost',
            port: '8081',
            // If using local domain for project change this.
            proxy: 'localhost:8888',
            open: false,
            files: [{
                match: ['./*.php'],
                fn: function (event, file) {
                    if (event === "change") {
                        const bs = require('browser-sync').get('bs-webpack-plugin');
                        bs.reload();
                    }
                }
            },
                {
                    match: ['./*.css', '.js/*.js'],
                    fn: function (event, file) {
                        if (event === "change") {
                            const bs = require('browser-sync').get('bs-webpack-plugin');
                            bs.stream();
                        }
                    }
                }],
            injectChanges: true,
            notify: true
        })
    ],
    optimization: {
        minimizer: [
            // enable the js minification plugin
            new UglifyJSPlugin({
                cache: true,
                parallel: true
            }),
            // enable the css minification plugin
            new OptimizeCSSAssetsPlugin({})
        ]
    },
    externals: {
        jquery: 'jQuery'
    },
};
