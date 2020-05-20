/**
 * Created by johnson on 09.05.17.
 */
const path = require('path');
const webpack = require('webpack');

module.exports = {
    context  : path.resolve(__dirname, './src'),
    entry    : {
        drawpoint: "./index.ts",
    },
    output   : {
        filename     : '[name].js',
        path         : path.resolve(__dirname, 'dist'),
        publicPath   : '/',
        library      : 'drawpoint',
        libraryTarget: 'umd',
    },
    devServer: {
        publicPath: "./dist",
        public    : "localhost:8080/demo",
    },
    devtool  : "source-map",
    resolve     : {
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },
    module   : {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            {test: /\.tsx?$/, loader: "awesome-typescript-loader"},

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {test: /\.js$/, loader: "source-map-loader"},
            {
                test   : /\.js$/,
                include: [/src/],
                use    : {
                    loader : 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
        ]
    },
    plugins     : [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
            },
            __VERSION__  : JSON.stringify(require("./package.json").version),
        })
    ]
};
