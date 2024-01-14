const path = require('path');
const WrapperPlugin = require('./webpack_plugins/webpack_wrapper');

module.exports = {
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: ['ts-loader'],
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new WrapperPlugin({
            test: /\.js$/,
            header: 'javascript: (function(){',
            footer: '})();',
            afterOptimizations: true,
        }),
    ],
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        filename: '[name].min.js',
        path: path.resolve(__dirname, 'build'),
        clean: true,
    },
};
