'use strict';
const chokidar = require('chokidar');
const path = require('path');
const chalk = require('chalk');
const { spawn, execSync, spawnSync } = require('child_process');
const { log } = console;

/**
 * @param {path.PlatformPath} filePathToWatch
 */
const watch = (filePathToWatch) => {
    if (!path.isAbsolute(filePathToWatch)) {
        filePathToWatch = path.join(process.cwd(), filePathToWatch);
    }

    const watcher = chokidar.watch(filePathToWatch);

    log(
        chalk.blue.bold(
            `Watching : ${path.relative(process.cwd(), filePathToWatch)}`
        )
    );

    watcher.on('change', (pathOfFile, _) => {
        const relPath = path.relative(process.cwd(), pathOfFile);
        const details = path.parse(filePathToWatch);
        log(chalk.cyan('File changed :', relPath));

        const compile = spawn('gcc', [relPath, '-o', details.name]);

        compile.stderr.on('data', (data) => {
            log(chalk.red(data.toString()), '\t');
        });

        compile.on('exit', (code) => {
            log(
                chalk.green`File exited : ${details.name}${
                    details.ext
                } exited with code ${code} ${
                    code === 0 ? 'with no errors' : ''
                }`
            );
        });
    });
};

/**
 * @param {path.PlatformPath} filePathToWatch
 */
const run = async (filePathToRun) => {
    if (!path.isAbsolute(filePathToRun)) {
        filePathToRun = path.join(process.cwd(), filePathToRun);
    }

    const relPath = path.relative(process.cwd(), filePathToRun);
    const details = path.parse(filePathToRun);

    const compile = spawn('gcc', [relPath, '-o', details.name]);

    compile.stderr.on('data', (data) => {
        log(chalk.red(data.toString()), '\t');
    });

    compile.on('exit', (code) => {
        if (code === 0) {
            log(
                chalk.green(
                    `Successfully Compiled ${details.name}${details.ext} with no errors....`
                )
            );

            log(chalk.blue(`Running ${details.name}...`));
            const invoke = spawn(`${path.join(process.cwd(), details.name)}`, {
                stdio: [process.stdin, process.stdout, process.stderr],
            });

            invoke.on('exit', (code) => {
                log(
                    chalk.green`\nFile exited : ${details.name}${
                        details.ext
                    } exited with code ${code} ${
                        code === 0 ? 'with no errors' : ''
                    }`
                );

                return;
            });
        }
    });
};

module.exports.watch = watch;
module.exports.run = run;
