const path = require('path')
const hbs = require('hbs')

const registerPartialsWithExtensions = require('./utils/registerPartialsWithExtensions')

function toJSON (obj) {
    if (typeof obj === 'object') {
        return JSON.stringify(obj)
    }
    return obj
}

module.exports = (app) => {
    const templates = path.resolve(__dirname, 'templates')
    registerPartialsWithExtensions(hbs, templates)
    hbs.registerHelper('toJSON', toJSON)
    app.engine('hbs', hbs.__express)
    app.set('views', templates)
}