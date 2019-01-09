module.exports = function(dts) {
    return `
export interface Service {
    ${dts}
}

declare const service: Service;

export default service
    `
}