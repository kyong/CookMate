'use strict';
var path = require('path');
var webpack = require('webpack');
var env = process.env.NODE_ENV;
let config = {
    entry: {
        app :'./src/ts/index.ts'
    },
    output: {
        filename: 'index.js'
    },
    resolve: {
        extensions:['', '.ts', '.webpack.js', '.web.js', '.js']
    },
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader' }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV' : JSON.stringify(env)
        }),
        new webpack.optimize.OccurrenceOrderPlugin()
    ]
};

if (env === 'production') {
    config.output.filename = 'index.min.js';
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    }));
} else {
    config.devtool = 'source-map';
}

module.exports = config;