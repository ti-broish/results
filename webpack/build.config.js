const webpack = require('webpack');
const { merge } = require('webpack-merge');
const baseConfig = require('./base.config.js');

module.exports = env => {
    return merge(baseConfig(env), {
        mode: 'production',
        plugins: [
            new webpack.LoaderOptionsPlugin({minimize: true}),
        ]
    });
};
