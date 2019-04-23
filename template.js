module.exports = function (declareFilePath, services) {
    return `
/// <reference path="${declareFilePath}" />
const config = require('./config');
const request = require('./request');
const gateway = require('./gateway');

const Service = {
    ${services}
};

module.exports = Service;
    `
}