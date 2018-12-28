module.exports = function(declareFilePath, services) {
    return `
/// <reference path="${declareFilePath}" />
const config = require('./config');
const sysinfo = 'server api crashed';

const Service = {
    ajaxCommon(params = {
        url: '',
        method: 'GET',
        data: {},
        headers: {}
    }) {
        return new Promise((resolve, reject) => {
            let data = Object.assign({}, config.antifraud.tail, params.data);
            $.ajax({
                url: params.url,
                type: params.type || params.method || 'GET',
                dataType: params.dataType || 'json',
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                data,
                headers: params.headers,
            }).done((res) => {
                let {
                    code,
                } = res;
                if (res.isSuccess || res.success) {
                    resolve(res);
                } else if (code === 'C313' || code === 'C303' || code === 'C304') { // 活动已结束、下架
                    _zax.ui.toast(res.msg || res.message);
                    reject(res);
                } else {
                    _zax.ui.toast(res.message);
                    reject(res);
                }
            }).fail((res) => {
                config.debug ? _zax.ui.toast(sysinfo) : console.log(res)
                reject(res);
            });
        })
    },
    ${services}
};

module.exports = Service;
    `
}