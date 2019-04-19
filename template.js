module.exports = function (declareFilePath, services) {
    return `
/// <reference path="${declareFilePath}" />
const config = require('./config');
const request = require('./ajax');
const gateway = require('./gateway');

const Service = {
    ${services}
};

module.exports = Service;
    `
}