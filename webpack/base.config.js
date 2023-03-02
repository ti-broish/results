const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const LoadablePlugin = require('@loadable/webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = env => {
    return {
        entry: './src/index.js',
        output: {
            publicPath: '/',
            path: path.join(__dirname, '../dist'),
            filename: 'bundle.[contenthash].js',
            chunkFilename: '[name].[contenthash].bundle.js',
        },
        module: {
            rules: [{
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    plugins: [
                        "@loadable/babel-plugin",
                        "@babel/transform-runtime"
                    ],
                    presets: [
                        "@babel/preset-env",
                        "@babel/preset-react"
                    ]
                }
            }, {
                test: /\.css$/,
                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader"
                }],
            }, {
                test: [/\.woff?$/, /\.woff2?$/, /\.otf?$/, /\.ttf?$/, /\.eot?$/, /\.svg?$/, /\.png?$/, /\.gif?$/],
                loader: 'url-loader'
            }, {
                test: /\.ejs$/,
                loader: 'ejs-loader',
                options: { variable: 'data' }
            }]
        },
        plugins: [
            new CleanWebpackPlugin(),
            new LoadablePlugin(),
            new CopyWebpackPlugin({ patterns: [ { from: './static/' } ]}),
            new HtmlWebpackPlugin({
                title: 'Ти Броиш',
                template: 'src/index.ejs',
                publicPath: env['PUBLIC_URL']? env['PUBLIC_URL'] : '/'
            }),
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
                    'PUBLIC_URL': JSON.stringify(process.env.PUBLIC_URL),
                    'DATA_URL': JSON.stringify(process.env.DATA_URL),
                },
            }),
        ],
    }
};
