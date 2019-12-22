const glob = require('glob')
const titles = require("./titles");
const pages = {}

glob.sync('./pages/**/main.js').forEach(path => {
    const chunk = path.split('./pages/')[1].split('/main.js')[0]
    pages[chunk] = {
        baseUrl: "./",
        entry: path,
        template: 'public/index.html',
        title: titles[chunk] || chunk,
        chunks: ['chunk-vendors', 'chunk-common', chunk]
    }
})
console.log(pages)

module.exports = {
    pages: pages,
    chainWebpack: config => config.plugins.delete('named-chunks'),
    devServer: {
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:8080',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
}