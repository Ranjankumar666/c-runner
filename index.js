#! /usr/bin/env node
'use strict';
const { watch, run } = require('./runner');
const fs = require('fs').promises;
const { Command } = require('commander');
const checkErrorType = require('./utils/checkErrorType');

const program = new Command();

program.version('1.0.0', '-v, --version');
program.option('-f, --files [type...]', 'One or more C files to watch');
program.option('-r, --run [type...]', 'One or more C file to compile and run');
program.parse(process.argv);

const options = program.opts();

if (options.files) {
    options.files.forEach(async (filePath) => {
        try {
            await fs.access(filePath);
            watch(filePath);
        } catch (error) {
            checkErrorType(error);
        }
    });
}

if (options.run) {
    options.run.forEach(async (file) => {
        try {
            await fs.access(file);
            await run(file);
        } catch (error) {
            checkErrorType(error);
        }
    });
}
