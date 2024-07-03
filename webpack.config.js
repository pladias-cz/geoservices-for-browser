const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');
const env = dotenv.config().parsed;

module.exports = {
    mode: 'production',
    entry: './src/index.js',
    output: {
        path: path.resolve('dist'),
        filename: 'index.js',
        libraryTarget: 'commonjs2',
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /(node_modules)/,
                use: 'babel-loader',
            },
        ],
    },
    resolve: {
        extensions: ['.js'],
    },
    plugins: [
        new webpack.DefinePlugin({ //https://webpack.js.org/plugins/define-plugin/
            'process.env': JSON.stringify(env)
        })
    ]
};