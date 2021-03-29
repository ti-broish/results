const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const LoadablePlugin = require('@loadable/webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');    

module.exports = {
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
                    "@loadable/babel-plugin"
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
            title: 'Резултати от избори',
            template: 'src/index.ejs',
            //publicPath: '/results/parl2017'
        }),
    ],
};