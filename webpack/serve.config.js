const webpack = require('webpack');
const path = require('path');
const { merge } = require('webpack-merge');
const baseConfig = require('./base.config.js');

module.exports = env => {
    return merge(baseConfig(env), {
        mode: 'development',
        devtool: 'eval-source-map',
        devServer: {
            publicPath: '/',
            contentBase: [path.join(__dirname, '../dist')],
            historyApiFallback: true,
            port: 3000,
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify('development'),
                    'DATA_URL': JSON.stringify(env['DATA_URL']),
                }
            }),
        ]
    });
};