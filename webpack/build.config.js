const webpack = require('webpack');
const { merge } = require('webpack-merge');
const baseConfig = require('./base.config.js');

module.exports = env => {
    return merge(baseConfig, {
        mode: 'production',
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify('production'),
                    'API_HOST': JSON.stringify(env['API_HOST']),
                }
            }),
            new webpack.LoaderOptionsPlugin({minimize: true}),
        ]
    });
};