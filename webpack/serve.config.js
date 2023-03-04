const path = require('path');
const { merge } = require('webpack-merge');
const baseConfig = require('./base.config.js');

module.exports = env => {
    return merge(baseConfig(env), {
        mode: 'development',
        devtool: 'eval-source-map',
        devServer: {
            devMiddleware: {
                publicPath: '/',
            },
            static: {
                directory: path.join(__dirname, '../dist'),
            },
            historyApiFallback: true,
            port: 2000,
        },
    });
};
