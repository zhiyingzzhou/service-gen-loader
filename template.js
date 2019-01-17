module.exports = function(declareFilePath, services) {
    return `
/// <reference path="${declareFilePath}" />
const config = require('./config');
const ajax = require('./ajax');

const Service = {
    ...ajax,
    ${services}
};

module.exports = Service;
    `
}
