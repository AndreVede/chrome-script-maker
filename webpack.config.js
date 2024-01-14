const path = require('path');
const fs = require('fs');
const WrapperPlugin = require('./webpack_plugins/webpack_wrapper');

const scriptsPath = path.resolve(__dirname, 'src/scripts/');

const scripts = fs.readdirSync(scriptsPath);

const entries = scripts.reduce((obj, item) => {
    return {
        ...obj,
        [item.replace(/.ts$/, '')]: path.join(scriptsPath, item),
    };
}, {});

// show scipts list
console.log(entries);

module.exports = {
    entry: entries,
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: path.resolve(
                                __dirname,
                                'tsconfig.json',
                            ),
                        },
                    },
                ],
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
        alias: {
            '@src': path.resolve(__dirname, 'src'),
        },
    },
    output: {
        filename: '[name].min.js',
        path: path.resolve(__dirname, 'build'),
        clean: true,
    },
};
