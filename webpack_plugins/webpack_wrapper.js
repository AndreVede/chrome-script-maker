'use strict';

const ModuleFilenameHelpers = require('webpack/lib/ModuleFilenameHelpers');

class WrapperPlugin {
    /**
     * @param {Object} args
     * @param {string | Function} [args.header]  Text that will be prepended to an output file.
     * @param {string | Function} [args.footer] Text that will be appended to an output file.
     * @param {string | RegExp} [args.test] Tested against output file names to check if they should be affected by this
     * plugin.
     * @param {boolean} [args.afterOptimizations=false] Indicating whether this plugin should be activated before
     * (`false`) or after (`true`) the optimization stage. Example use case: Set this to true if you want to avoid
     * minification from affecting the text added by this plugin.
     */
    constructor(args) {
        if (typeof args !== 'object') {
            throw new TypeError('Argument "args" must be an object.');
        }

        this.header = args.hasOwnProperty('header') ? args.header : '';
        this.footer = args.hasOwnProperty('footer') ? args.footer : '';
        this.afterOptimizations = args.hasOwnProperty('afterOptimizations')
            ? !!args.afterOptimizations
            : false;
        this.test = args.hasOwnProperty('test') ? args.test : '';
    }

    apply(compiler) {
        const ConcatSource = getSourceConcatenator(compiler);

        const header = this.header;
        const footer = this.footer;
        const tester = { test: this.test };

        compiler.hooks.compilation.tap('WrapperPlugin', (compilation) => {
            if (this.afterOptimizations) {
                compilation.hooks.afterProcessAssets.tap(
                    'WrapperPlugin',
                    (assets) => {
                        wrapAssets(compilation, assets, footer, header);
                    },
                );
            } else {
                compilation.hooks.processAssets.tap(
                    {
                        name: 'WrapperPlugin',
                        stage: compilation.PROCESS_ASSETS_STAGE_OPTIMIZE, // see below for more stages
                    },
                    (assets) => {
                        wrapAssets(compilation, assets, footer, header);
                    },
                );
            }
        });

        function wrapFile(compilation, fileName) {
            const headerContent =
                typeof header === 'function' ? header(fileName) : header;
            const footerContent =
                typeof footer === 'function' ? footer(fileName) : footer;

            compilation.assets[fileName] = new ConcatSource(
                String(headerContent),
                compilation.assets[fileName],
                String(footerContent),
            );
        }

        function wrapAssets(compilation, assets) {
            Object.entries(assets).forEach(([pathname, source]) => {
                //const info = compilation.assetsInfo.get(pathname);

                if (ModuleFilenameHelpers.matchObject(tester, pathname)) {
                    wrapFile(compilation, pathname);
                }
            });
        }
    }
}

module.exports = WrapperPlugin;

function getSourceConcatenator(compiler) {
    const webpack = compiler.webpack;
    if (webpack) {
        // webpack v5
        return webpack.sources.ConcatSource;
    }
    // webpack v4
    return require('webpack-sources').ConcatSource;
}
