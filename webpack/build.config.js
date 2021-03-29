const webpack = require('webpack');
const { merge } = require('webpack-merge');
const baseConfig = require('./base.config.js');

module.exports = env => {
    return merge(baseConfig(env), {
        mode: 'production',
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify('production'),
                    'DATA_URL': JSON.stringify(env['DATA_URL']),
                    'PUBLIC_URL': JSON.stringify(env['PUBLIC_URL']),
                }
            }),
            new webpack.LoaderOptionsPlugin({minimize: true}),
        ]
    });
};