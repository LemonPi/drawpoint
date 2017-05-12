/**
 * Created by johnson on 09.05.17.
 */
const path = require('path');
const webpack = require('webpack');

module.exports = {
    context: path.resolve(__dirname, './src'),
    entry: {
        drawpoint: "./index.js",
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        library: 'drawpoint',
        libraryTarget: 'umd',
    },
    devServer: {
        publicPath: "/dist",
    },
    devtool: "cheap-module-source-map",
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [/node_modules/],
                use: [{
                    loader: 'babel-loader',
                    options: {presets: ['es2015']},
                }],
            },
        ]
    },
};
