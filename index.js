/* eslint-disable */
const path = require('path');
const fs = require('fs');
const loaderUtils = require('loader-utils');
const validateOptions = require('schema-utils');
const cTable = require('console.table');
const chalk = require('chalk');
const schema = require('./options.json');
const template = require('./template');
const dts = require('./dts-template');

const constantcase = str => {
    return str.replace(/([a-zA-Z])(?=[A-Z])/g, '$1_').toUpperCase()
}

const camelcase = str => {
    return str.toLowerCase()
        .replace(/[-_]+/g, ' ')
        .replace(/[^\w\s]/g, '')
        .replace(/ (.)/g, function($1) {
            return $1.toUpperCase();
        })
        .replace(/\s+/g, '');
}

const emitFile = (path, content) => {
    fs.writeFileSync(path, content);
}

module.exports = function(content, stats) {
    const options = loaderUtils.getOptions(this);
    const context = this.context;
    // validate options
    validateOptions(schema, options, 'generate service Loader');

    // cache loader
    this.cacheable();

    let fileName = '',
        declareFileName = '',
        filePath = '',
        declareFilePath = '',
        ext = path.extname(options.fileName);

    if (options.fileName) {
        fileName = options.fileName;
    } else {
        this.emitError(new Error("fileName option can't be null"));
    }


    if (options.filePath) {
        if (typeof options.filePath === 'function') {
            filePath = path.posix.join(options.filePath(this), fileName);
        } else {
            filePath = path.posix.join(options.filePath, fileName);
        }
    } else {
        // 默认输出到当前
        filePath = path.posix.join(context, fileName);
    }

    if (options.declareFileName) {
        declareFileName = options.declareFileName;
    } else {
        declareFileName = fileName.replace(ext, '.d.ts');
    }

    if (options.declareFilePath) {
        if (typeof options.filePath === 'function') {
            declareFilePath = path.posix.join(options.declareFilePath(this), declareFileName);
        } else {
            declareFilePath = path.posix.join(options.declareFilePath, declareFileName);
        }
    } else {
        declareFilePath = path.posix.join(context, declareFileName);
    }

    const mappings = JSON.parse(content.replace(/;/g, ''));

    let serviceStr = "",
        dtsStr = '',
        tableData = [];

    mappings.forEach((item, index) => {
        const { name, url, method, gateway = '', headers = {}, description = '' } = item;

        const last = url.split('/').pop();

        const funcname = name || camelcase('api_' + constantcase(last));

        tableData[index] = {
            "request-url": url,
            "function-name": chalk.green(funcname)
        }

        serviceStr += `
            ${funcname}(data = {}) {
                return Service.ajaxCommon({
                    url: (config["${gateway}"] || '') + "${url}",
                    method: "${method}",
                    data,
                    headers: ${JSON.stringify(headers)}
                });
            },
        `;
        dtsStr += `
            ${description && 
            `
            /**
             * ${description}
             */
            `
            }
            ${funcname}(data: any): this;
        `
    });

    // // generate typeing file
    emitFile(declareFilePath, dts(dtsStr));

    console.log('\r\n');

    console.table(tableData);
    // generate service path
    emitFile(filePath, template(declareFilePath, serviceStr));

    return "{}";
}