'use strict';
const { log } = console;
const chalk = require('chalk');

/**
 * @param {Error} error
 */
module.exports.checkErrorType = function checkErrorType(error) {
    if (error.errno === -4058) {
        log(chalk.red`Path doesn't exists : ${options.run}`);
    } else {
        log(chalk.red`Error Message: ${error.message}`);
    }
};
