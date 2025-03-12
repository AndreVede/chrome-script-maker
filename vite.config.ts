import { defineConfig } from 'vite';
import * as path from 'path';
import { wrapperPlugin } from './vite_plugins/vite_wrapper';

// Configure Vite
export default defineConfig({
    plugins: [
        wrapperPlugin({
            test: /\.js$/,
            minifyWithTerser: {},
            header: 'javascript: (function(){',
            footer: '})();',
        }),
    ],
    resolve: {
        alias: {
            '@src': path.resolve(import.meta.dirname, 'src'),
        },
    },
    build: {
        emptyOutDir: false, // we loop for each file
        minify: false, // called in plugin
        target: 'es2015',
        outDir: 'build',
        rollupOptions: {
            output: {
                compact: true,
                format: 'cjs',
                preserveModules: false,
                entryFileNames: '[name].min.js',
                inlineDynamicImports: true,
            },
        },
        ssr: true,
    },
    ssr: {
        target: 'webworker',
    },
});
