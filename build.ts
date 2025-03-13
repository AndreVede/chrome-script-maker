import { build } from 'vite';
import * as path from 'path';
import * as fs from 'fs';
import { parseArgs } from 'util';

// Catch watch argument
const { values } = parseArgs({
    args: Bun.argv,
    options: {
        watch: {
            type: 'boolean',
        },
    },
    strict: true,
    allowPositionals: true,
});
const watch = values.watch;

// Where are scripts
const scriptsPath = path.resolve(__dirname, 'src/scripts/');

const scripts = fs.readdirSync(scriptsPath);

// show scripts list
console.log(`I'm working on:\n${scripts.join('\n')}\n`);

// cleanup build dir
const outDir = path.join(__dirname, 'build');

// check if outDir exist and create it
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
}

const contentList = fs.readdirSync(outDir);
for (const content of contentList) {
    fs.rm(
        path.join(outDir, content),
        { recursive: true, force: true },
        (err) => {
            if (err) {
                throw err;
            }
        },
    );
}

scripts.forEach(async (entry) => {
    await build({
        configFile: path.resolve(__dirname, 'vite.config.ts'),
        build: {
            rollupOptions: {
                input: path.join(scriptsPath, entry),
            },
            watch: watch ? {} : undefined,
        },
    });
});
