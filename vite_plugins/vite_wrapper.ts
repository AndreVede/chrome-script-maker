import { typescriptEslint } from '@typescript-eslint/eslint-plugin';
import { OutputAsset, OutputChunk, OutputOptions } from 'rollup';
import { minify, MinifyOptions } from 'terser';

export interface WrapperPluginConfig {
    test?: RegExp;
    minifyWithTerser?: boolean | MinifyOptions;
    header?: string;
    footer?: string;
}

export const wrapperPlugin = (args?: WrapperPluginConfig) => ({
    name: 'wrapper-plugin',
    async generateBundle(
        options: OutputOptions,
        bundle: { [fileName: string]: OutputAsset | OutputChunk },
        isWrite: boolean,
    ) {
        for (const [key, value] of Object.entries(bundle)) {
            if (isChunk(value)) {
                // minify
                const codePromise: Promise<string> = args?.minifyWithTerser
                    ? minify(
                          value.code,
                          isTerserConf(args.minifyWithTerser)
                              ? args.minifyWithTerser
                              : undefined,
                      ).then((output) => output.code ?? '')
                    : Promise.resolve(value.code);

                // wrapper
                await codePromise
                    .then((content) => {
                        const regex = args?.test;
                        if (regex) {
                            if (regex.test(value.preliminaryFileName)) {
                                return wrapCode(
                                    content,
                                    args?.header,
                                    args?.footer,
                                );
                            }
                        } else {
                            return wrapCode(
                                content,
                                args?.header,
                                args?.footer,
                            );
                        }
                        return '';
                    })
                    .then((output: string) => {
                        // write changes
                        value.code = output;
                    });
            }
        }
    },
});

const wrapCode = (code: string, header?: string, footer?: string) =>
    `${header}${code}${footer}`;

/**
 * Guard to check if it is `OutputChunk`
 */
const isChunk = (value: unknown): value is OutputChunk =>
    value !== null && typeof value === 'object' && Object.hasOwn(value, 'code');

/**
 * Guard to check if it is `MinifyOptions`
 */
const isTerserConf = (value: boolean | MinifyOptions): value is MinifyOptions =>
    typeof value !== 'boolean';
